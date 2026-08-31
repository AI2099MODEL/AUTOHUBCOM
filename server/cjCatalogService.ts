import { hasCjConfig } from "./integrationService.js";

type CjSyncInput = { apiToken: string; companyId: string; pid: string; keyword?: string; limit?: number };
export type CjProduct = { id: string; title: string; description: string; price: string; currency: string; advertiserName: string; clickUrl: string; imageUrl: string; syncedAt: string };
let syncedProducts: CjProduct[] = [];

export function getSyncedCjProducts() { return syncedProducts; }

export async function syncCjProducts(input: CjSyncInput) {
  if (!hasCjConfig()) return { ok: false, message: "Save and verify the CJ Affiliate configuration before syncing products.", products: [] as CjProduct[] } as const;
  if (!input.apiToken.trim() || input.apiToken.trim().length < 8) return { ok: false, message: "A CJ Personal Access Token is required for Product Feed API calls.", products: [] as CjProduct[] } as const;
  if (!input.companyId.trim() || !input.pid.trim()) return { ok: false, message: "CJ Company ID and Promotional Property ID are required.", products: [] as CjProduct[] } as const;
  const query = `{ products(companyId: "${input.companyId.replace(/[^0-9]/g, "")}", keywords: "${(input.keyword || "beauty").replace(/[^a-zA-Z0-9 -]/g, "")}") { resultList { advertiserName id title description price { amount currency } linkCode(pid: "${input.pid.replace(/[^0-9]/g, "")}") { clickUrl } } } }`;
  try {
    const response = await fetch("https://ads.api.cj.com/query", { method: "POST", headers: { Authorization: `Bearer ${input.apiToken.trim()}`, "Content-Type": "application/json" }, body: JSON.stringify({ query }) });
    const rawBody = await response.text();
    let payload: { data?: { products?: { resultList?: Array<any> } }; errors?: Array<{ message?: string }> } = {};
    if (rawBody.trim()) {
      try { payload = JSON.parse(rawBody); }
      catch { return { ok: false, message: `CJ Product Feed API returned HTTP ${response.status} with a non-JSON response. Check the endpoint, token, and CJ API access.`, products: [] as CjProduct[] } as const; }
    }
    if (!response.ok) return { ok: false, message: payload.errors?.map((error) => error.message).filter(Boolean).join("; ") || `CJ Product Feed API returned HTTP ${response.status}. Check the token, company ID, and advertiser relationships.`, products: [] as CjProduct[] } as const;
    if (payload.errors?.length) return { ok: false, message: payload.errors.map((error) => error.message).filter(Boolean).join("; ") || "CJ rejected the Product Feed request.", products: [] as CjProduct[] } as const;
    const rows = payload.data?.products?.resultList || [];
    syncedProducts = rows.filter((product) => product?.id && product?.title && product?.advertiserName && product?.linkCode?.clickUrl).slice(0, Math.min(input.limit || 12, 50)).map((product) => ({ id: String(product.id), title: String(product.title), description: String(product.description || ""), price: String(product.price?.amount || "View offer"), currency: String(product.price?.currency || ""), advertiserName: String(product.advertiserName), clickUrl: String(product.linkCode.clickUrl), imageUrl: String(product.imageUrl || product.image?.url || ""), syncedAt: new Date().toISOString() }));
    return { ok: true, message: `Synced ${syncedProducts.length} product${syncedProducts.length === 1 ? "" : "s"} from CJ Affiliate.`, products: syncedProducts } as const;
  } catch (error) { return { ok: false, message: error instanceof Error ? error.message : "CJ Product Feed request failed.", products: [] as CjProduct[] } as const; }
}
