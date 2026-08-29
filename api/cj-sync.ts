import type { VercelRequest, VercelResponse } from "@vercel/node";
import mysql from "mysql2/promise";

type Product = { id: string; title: string; description: string; price: string; currency: string; advertiserName: string; clickUrl: string; imageUrl: string; syncedAt: string };
const images = ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&auto=format&fit=crop&q=85", "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=900&auto=format&fit=crop&q=85", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&auto=format&fit=crop&q=85"];
const carImages = ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900&auto=format&fit=crop&q=85", "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&auto=format&fit=crop&q=85", "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900&auto=format&fit=crop&q=85"];
const beautyImages = ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=900&auto=format&fit=crop&q=85", "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=900&auto=format&fit=crop&q=85", "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=900&auto=format&fit=crop&q=85"];
const readBody = (req: VercelRequest) => typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
const xmlValue = (xml: string, tag: string) => xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"))?.[1]?.replace(/<!\\[CDATA\\[|\\]\\]>/g, "").trim() || "";
const allXml = (xml: string, tag: string) => [...xml.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi"))].map((m) => m[1]);
const error = (message: string) => ({ ok: false, message, products: [] as Product[] });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json(error("CJ endpoint only accepts POST requests."));
  let body: any; try { body = readBody(req); } catch { return res.status(400).json(error("The request body was not valid JSON.")); }
  const token = String(body.apiToken || process.env.CJ_API_TOKEN || "").trim();
  const pid = String(body.pid || process.env.CJ_PID || "").replace(/[^0-9]/g, "");
  const keyword = String(body.keyword || "").replace(/[^a-zA-Z0-9 +\-]/g, "");
  if (token.length < 8) return res.status(400).json(error("A CJ Personal Access Token is required."));
  if (!pid) return res.status(400).json(error("Brand Janra Promotional Property ID (PID) is required."));
  let connection: mysql.Connection | undefined;
  try {
    const params = new URLSearchParams({ "website-id": pid, "advertiser-ids": "joined", "records-per-page": "12" }); if (keyword) params.set("keywords", keyword);
    const upstream = await fetch(`https://link-search.api.cj.com/v2/link-search?${params.toString()}`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/xml" } });
    const raw = await upstream.text();
    if (!upstream.ok) { const message = xmlValue(raw, "error-message"); if (/no joined advertisers/i.test(message)) return res.status(200).json(error("Your CJ account is active, but it has no joined advertisers. Join at least one advertiser program in CJ, then sync again.")); return res.status(upstream.status === 401 ? 401 : 502).json(error(`CJ REST Link Search returned HTTP ${upstream.status}. ${message || "Check the PAT and PID."}`)); }
    if (!raw.trim()) return res.status(502).json(error("CJ REST Link Search returned an empty response."));
    const syncedAt = new Date().toISOString();
    const products = allXml(raw, "link").slice(0, 12).map((block, i) => { const advertiserName = xmlValue(block, "advertiser-name") || "CJ advertiser"; const title = xmlValue(block, "link-name") || advertiserName || "CJ partner offer"; const descriptor = `${advertiserName} ${title} ${xmlValue(block, "description")}`; const isCar = /carmel|limo|taxi|rental|car/i.test(descriptor); const isBeauty = /beauty|skin|hair|cosmetic|makeup|wellness|spa/i.test(descriptor); const fallback = isCar ? carImages[i % carImages.length] : isBeauty ? beautyImages[i % beautyImages.length] : images[i % images.length]; return { id: xmlValue(block, "link-id") || `cj-link-${i}`, title, description: xmlValue(block, "description") || "Promotional offer from a CJ advertiser.", price: "View offer", currency: "", advertiserName, clickUrl: xmlValue(block, "click-url") || xmlValue(block, "clickUrl"), imageUrl: xmlValue(block, "creative-image-url") || xmlValue(block, "image-url") || fallback, syncedAt }; });
    if (!process.env.DATABASE_URL) return res.status(503).json({ ok: false, message: "CJ links were fetched, but DATABASE_URL is not configured, so products could not be saved.", products });
    connection = await mysql.createConnection(process.env.DATABASE_URL);
    for (const product of products) await connection.query("INSERT INTO tracked_links (productId, token, source, network, externalLinkId, campaign, destinationUrl, imageUrl, linkStatus, firstSeenAt, lastSeenAt, lastCheckedAt) VALUES (0, ?, ?, 'cj', ?, ?, ?, ?, 'active', NOW(), NOW(), NOW()) ON DUPLICATE KEY UPDATE destinationUrl=VALUES(destinationUrl), imageUrl=VALUES(imageUrl), linkStatus='active', lastSeenAt=NOW(), lastCheckedAt=NOW(), lastCheckError=NULL", [`cj:${product.id}`, product.advertiserName, product.id, keyword || "joined-advertisers", product.clickUrl, product.imageUrl]);
    if (products.length) { const ids = products.map((p) => p.id); const placeholders = ids.map(() => "?").join(","); await connection.query(`UPDATE tracked_links SET linkStatus='expired', lastCheckedAt=NOW(), lastCheckError='Link no longer returned by CJ REST Link Search' WHERE network='cj' AND linkStatus='active' AND externalLinkId IS NOT NULL AND externalLinkId NOT IN (${placeholders})`, ids); }
    return res.status(200).json(products.length ? { ok: true, message: `Synced ${products.length} CJ link${products.length === 1 ? "" : "s"} using REST Link Search.`, products } : { ok: false, message: "CJ account is active, but no joined advertisers or eligible links were found.", products });
  } catch (e) { return res.status(502).json(error(e instanceof Error ? e.message : "CJ REST Link Search request failed.")); }
  finally { await connection?.end(); }
}
