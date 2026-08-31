import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

const getDatabaseUrl = () => process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.SUPABASE_DB_URL || "";
const getPostgresConnectionString = (raw: string) => { try { const url = new URL(raw); ["sslmode", "sslcert", "sslkey", "sslrootcert"].forEach((key) => url.searchParams.delete(key)); return url.toString(); } catch { return raw; } };

type Product = { id: string; title: string; description: string; price: string; currency: string; advertiserName: string; clickUrl: string; imageUrl: string; syncedAt: string };
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
  let pool: Pool | undefined;
  try {
    const params = new URLSearchParams({ "website-id": pid, "advertiser-ids": "joined", "records-per-page": "12" }); if (keyword) params.set("keywords", keyword);
    const upstream = await fetch(`https://link-search.api.cj.com/v2/link-search?${params.toString()}`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/xml" } });
    const raw = await upstream.text();
    if (!upstream.ok) { const message = xmlValue(raw, "error-message"); if (/no joined advertisers/i.test(message)) return res.status(200).json(error("Your CJ account is active, but it has no joined advertisers. Join at least one advertiser program in CJ, then sync again.")); return res.status(upstream.status === 401 ? 401 : 502).json(error(`CJ REST Link Search returned HTTP ${upstream.status}. ${message || "Check the PAT and PID."}`)); }
    if (!raw.trim()) return res.status(502).json(error("CJ REST Link Search returned an empty response."));
    const syncedAt = new Date().toISOString();
    const products = allXml(raw, "link").map((block) => { const advertiserName = xmlValue(block, "advertiser-name"); const title = xmlValue(block, "link-name"); const clickUrl = xmlValue(block, "click-url") || xmlValue(block, "clickUrl"); const id = xmlValue(block, "link-id"); if (!advertiserName || !title || !clickUrl || !id) return null; return { id, title, description: xmlValue(block, "description"), price: "View offer", currency: "", advertiserName, clickUrl, imageUrl: xmlValue(block, "creative-image-url") || xmlValue(block, "image-url"), syncedAt }; }).filter((product): product is Product => Boolean(product)).slice(0, 12);
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) return res.status(503).json({ ok: false, message: "CJ links were fetched, but no Vercel/Supabase PostgreSQL URL is configured, so products could not be saved.", products });
    pool = new Pool({ connectionString: getPostgresConnectionString(databaseUrl), ssl: { rejectUnauthorized: false }, max: 2 });
    for (const product of products) await pool.query(`INSERT INTO tracked_links ("productId", "token", "source", "network", "externalLinkId", "campaign", "destinationUrl", "imageUrl", "linkStatus", "firstSeenAt", "lastSeenAt", "lastCheckedAt") VALUES (0, $1, $2, 'cj', $3, $4, $5, $6, 'active', NOW(), NOW(), NOW()) ON CONFLICT ("token") DO UPDATE SET "destinationUrl" = EXCLUDED."destinationUrl", "imageUrl" = EXCLUDED."imageUrl", "linkStatus" = 'active', "lastSeenAt" = NOW(), "lastCheckedAt" = NOW(), "lastCheckError" = NULL`, [`cj:${product.id}`, product.advertiserName, product.id, keyword || "joined-advertisers", product.clickUrl, product.imageUrl]);
    if (products.length) { const ids = products.map((p) => p.id); const placeholders = ids.map((_, i) => `$${i + 1}`).join(","); await pool.query(`UPDATE tracked_links SET "linkStatus"='expired', "lastCheckedAt"=NOW(), "lastCheckError"='Link no longer returned by CJ REST Link Search' WHERE "network"='cj' AND "linkStatus"='active' AND "externalLinkId" IS NOT NULL AND "externalLinkId" NOT IN (${placeholders})`, ids); }
    return res.status(200).json(products.length ? { ok: true, message: `Synced ${products.length} CJ link${products.length === 1 ? "" : "s"} using REST Link Search.`, products } : { ok: false, message: "CJ account is active, but no joined advertisers or eligible links were found.", products });
  } catch (e) { return res.status(502).json(error(e instanceof Error ? e.message : "CJ REST Link Search request failed.")); }
  finally { await pool?.end(); }
}
