import type { VercelRequest, VercelResponse } from "@vercel/node";

type Product = { id: string; title: string; description: string; price: string; currency: string; advertiserName: string; clickUrl: string; imageUrl: string; syncedAt: string };
const images = ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&auto=format&fit=crop&q=85", "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=900&auto=format&fit=crop&q=85", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&auto=format&fit=crop&q=85"];
const carImages = ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900&auto=format&fit=crop&q=85", "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&auto=format&fit=crop&q=85", "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900&auto=format&fit=crop&q=85"];
const beautyImages = ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=900&auto=format&fit=crop&q=85", "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=900&auto=format&fit=crop&q=85", "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=900&auto=format&fit=crop&q=85"];
const travelImages = ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&auto=format&fit=crop&q=85", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop&q=85", "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&auto=format&fit=crop&q=85"];
const readBody = (req: VercelRequest) => typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
const xmlValue = (xml: string, tag: string) => { const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i")); return match?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, "").trim() || ""; };
const allXml = (xml: string, tag: string) => [...xml.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi"))].map((m) => m[1]);
function error(message: string) { return { ok: false, message, products: [] as Product[] }; }
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json(error("CJ endpoint only accepts POST requests."));
  let body: any; try { body = readBody(req); } catch { return res.status(400).json(error("The request body was not valid JSON.")); }
  const token = String(body.apiToken || "").trim();
  const endpoint = "https://link-search.api.cj.com/v2/link-search";
  if (token.length < 8) return res.status(400).json(error("A CJ Personal Access Token is required."));
  const pid = String(body.pid || "").replace(/[^0-9]/g, "");
  if (!pid) return res.status(400).json(error("Brand Janra Promotional Property ID (PID) is required."));
  const keyword = String(body.keyword || "").replace(/[^a-zA-Z0-9 +\-]/g, "");
  try {
    const params = new URLSearchParams({ "website-id": pid, "advertiser-ids": "joined", "records-per-page": "12" });
    if (keyword) params.set("keywords", keyword);
    const url = `${endpoint}?${params.toString()}`;
    const upstream = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: "application/xml" } });
    const raw = await upstream.text();
    if (!upstream.ok) {
      const cjMessage = xmlValue(raw, "error-message");
      if (/no joined advertisers/i.test(cjMessage)) return res.status(200).json(error("Your CJ account is active, but it has no joined advertisers. Join at least one advertiser program in CJ, then return here and sync products again."));
      return res.status(upstream.status === 401 ? 401 : 502).json(error(`CJ REST Link Search returned HTTP ${upstream.status}. ${cjMessage || "Check that the PAT is registered for this PID."}`));
    }
    if (!raw.trim()) return res.status(502).json(error("CJ REST Link Search returned an empty response."));
    const linkBlocks = allXml(raw, "link");
    const products = linkBlocks.slice(0, 12).map((block, i) => { const advertiserName = xmlValue(block, "advertiser-name") || "CJ advertiser"; const title = xmlValue(block, "link-name") || advertiserName || "CJ partner offer"; const descriptor = `${advertiserName} ${title} ${xmlValue(block, "description")}`; const isCar = /carmel|limo|taxi|rental|car/i.test(descriptor); const isBeauty = /beauty|skin|hair|cosmetic|makeup|wellness|spa/i.test(descriptor); const isTravel = /travel|hotel|flight|tour|vacation|holiday/i.test(descriptor); const fallback = isCar ? carImages[i % carImages.length] : isBeauty ? beautyImages[i % beautyImages.length] : isTravel ? travelImages[i % travelImages.length] : images[i % images.length]; return { id: xmlValue(block, "link-id") || `cj-link-${i}`, title, description: xmlValue(block, "description") || "Promotional offer from a CJ advertiser.", price: "View offer", currency: "", advertiserName, clickUrl: xmlValue(block, "click-url") || xmlValue(block, "clickUrl"), imageUrl: xmlValue(block, "creative-image-url") || xmlValue(block, "image-url") || fallback, syncedAt: new Date().toISOString() }; });
    const { getTrackedLinkLifecycle, markTrackedLinkCheck, upsertTrackedLink } = await import("../server/db");
    const previous = await getTrackedLinkLifecycle();
    const currentIds = new Set(products.map((product) => product.id));
    for (const product of products) await upsertTrackedLink({ productId: 0, token: `cj:${product.id}`, source: product.advertiserName, network: "cj", externalLinkId: product.id, campaign: keyword || "joined-advertisers", destinationUrl: product.clickUrl, imageUrl: product.imageUrl, status: "active" });
    for (const link of previous.filter((link) => link.network === "cj" && link.linkStatus === "active" && link.externalLinkId && !currentIds.has(link.externalLinkId))) await markTrackedLinkCheck(link.id, false, "Link no longer returned by CJ REST Link Search");
    if (products.length === 0) return res.status(200).json({ ok: false, message: "CJ account is active, but no joined advertisers or eligible links were found. Join at least one advertiser in CJ, then sync again.", products });
    return res.status(200).json({ ok: true, message: `Synced ${products.length} CJ link${products.length === 1 ? "" : "s"} using REST Link Search.`, products });
  } catch (e) { return res.status(502).json(error(e instanceof Error ? e.message : "CJ REST Link Search request failed.")); }
}
