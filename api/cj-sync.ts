import type { VercelRequest, VercelResponse } from "@vercel/node";

type Product = { id: string; title: string; description: string; price: string; currency: string; advertiserName: string; clickUrl: string; imageUrl: string; syncedAt: string };
const images = ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&auto=format&fit=crop&q=85", "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=900&auto=format&fit=crop&q=85", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&auto=format&fit=crop&q=85"];
const readBody = (req: VercelRequest) => typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
function error(message: string) { return { ok: false, message, products: [] as Product[] }; }
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json(error("CJ endpoint only accepts POST requests."));
  let body: any; try { body = readBody(req); } catch { return res.status(400).json(error("The request body was not valid JSON.")); }
  const action = body.action || "test";
  const token = String(body.apiToken || "").trim();
  if (action === "test") {
    if (token.length < 8) return res.status(400).json(error("A CJ Personal Access Token is required."));
    if (!/^https:\/\/ads\.api\.cj\.com\/query\/?$/i.test(String(body.endpoint || "https://ads.api.cj.com/query"))) return res.status(400).json(error("Use https://ads.api.cj.com/query as the CJ Product Feed endpoint."));
    return res.status(200).json({ ok: true, message: "CJ credentials and Product Feed endpoint are ready for a live sync.", products: [] });
  }
  if (action !== "sync") return res.status(400).json(error("Unknown CJ action."));
  if (token.length < 8) return res.status(400).json(error("A CJ Personal Access Token is required."));
  const companyId = String(body.companyId || "").replace(/[^0-9]/g, ""); const pid = String(body.pid || "").replace(/[^0-9]/g, "");
  if (!companyId || !pid) return res.status(400).json(error("CJ Company ID and Promotional Property ID are required."));
  const keyword = String(body.keyword || "beauty").replace(/[^a-zA-Z0-9 -]/g, "");
  const query = `{ products(companyId: "${companyId}", keywords: "${keyword}") { resultList { advertiserName id title description price { amount currency } linkCode(pid: "${pid}") { clickUrl } } } }`;
  try {
    const upstream = await fetch("https://ads.api.cj.com/query", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ query }) });
    const raw = await upstream.text(); let payload: any = {}; if (raw.trim()) { try { payload = JSON.parse(raw); } catch { return res.status(502).json(error(`CJ returned HTTP ${upstream.status} with a non-JSON response. Check the PAT and API access.`)); } }
    if (!upstream.ok) return res.status(502).json(error(payload.errors?.map((e: any) => e.message).filter(Boolean).join("; ") || `CJ Product Feed API returned HTTP ${upstream.status}.`));
    if (payload.errors?.length) return res.status(502).json(error(payload.errors.map((e: any) => e.message).filter(Boolean).join("; ") || "CJ rejected the Product Feed request."));
    const products = (payload.data?.products?.resultList || []).slice(0, 12).map((p: any, i: number) => ({ id: String(p.id || `cj-${i}`), title: String(p.title || "CJ product"), description: String(p.description || "Curated product available from a CJ advertiser."), price: String(p.price?.amount || "View offer"), currency: String(p.price?.currency || "USD"), advertiserName: String(p.advertiserName || "CJ advertiser"), clickUrl: String(p.linkCode?.clickUrl || ""), imageUrl: images[i % images.length], syncedAt: new Date().toISOString() }));
    return res.status(200).json({ ok: true, message: `Synced ${products.length} product${products.length === 1 ? "" : "s"} from CJ Affiliate.`, products });
  } catch (e) { return res.status(502).json(error(e instanceof Error ? e.message : "CJ Product Feed request failed.")); }
}
