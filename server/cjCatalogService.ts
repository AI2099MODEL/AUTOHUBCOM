import { eq, sql } from "drizzle-orm";
import { getDb, upsertTrackedLink } from "./db.js";
import { products, trackedLinks } from "../drizzle/schema.js";

type CjSyncInput = { apiToken: string; companyId: string; pid: string; keyword?: string; limit?: number };
export type CjProduct = { id: string; title: string; description: string; price: string; currency: string; advertiserName: string; clickUrl: string; imageUrl: string; syncedAt: string; trackingToken: string; network: string; marketHint: string };
let syncedProducts: CjProduct[] = [];

export async function getSyncedAffiliateProducts(): Promise<CjProduct[]> {
  const db = await getDb();
  if (!db) return syncedProducts;
  try {
    const rows = await db.select({
      id: trackedLinks.externalLinkId,
      trackingToken: trackedLinks.token,
      network: trackedLinks.network,
      title: products.name,
      description: products.description,
      price: products.price,
      currency: products.currency,
      advertiserName: trackedLinks.source,
      clickUrl: trackedLinks.destinationUrl,
      imageUrl: trackedLinks.imageUrl,
      syncedAt: trackedLinks.lastSeenAt,
    }).from(trackedLinks).innerJoin(products, eq(trackedLinks.productId, products.id)).where(sql`${trackedLinks.network} = 'cj' AND ${trackedLinks.linkStatus} = 'active' AND ${products.destinationUrl} IS NOT NULL`).orderBy(sql`${trackedLinks.lastSeenAt} desc`).limit(50);
    const awinRows = await db.execute(sql`SELECT atl.external_link_id AS "externalLinkId", atl.token AS "trackingToken", 'awin' AS network, ap.title, ap.description, ap.price, ap.currency, ap.advertiser_name AS "advertiserName", atl.destination_url AS "clickUrl", atl.image_url AS "imageUrl", atl.last_seen_at AS "syncedAt" FROM awin_tracked_links atl INNER JOIN awin_products ap ON ap.id = atl.awin_product_id WHERE atl.link_status = 'active' AND ap.status = 'active' ORDER BY atl.last_seen_at DESC LIMIT 500`);
    const genericProducts = rows.filter((row) => row.id && row.clickUrl && row.trackingToken).map((row) => ({
      id: String(row.id), trackingToken: String(row.trackingToken), network: String(row.network || "affiliate"), title: row.title, description: row.description, price: row.price ? String(row.price) : "", currency: row.currency || "", advertiserName: row.advertiserName, clickUrl: row.clickUrl, imageUrl: row.imageUrl || "", syncedAt: row.syncedAt.toISOString(), marketHint: `${row.currency || ""} ${row.title || ""} ${row.description || ""} ${row.advertiserName || ""}`.toLowerCase(),
    }));
    const dedicatedAwinProducts = (awinRows as unknown as Array<Record<string, unknown>>).filter((row) => row.externalLinkId && row.clickUrl && row.trackingToken).map((row) => ({
      id: String(row.externalLinkId), trackingToken: String(row.trackingToken), network: "awin", title: String(row.title || ""), description: String(row.description || ""), price: row.price ? String(row.price) : "", currency: String(row.currency || ""), advertiserName: String(row.advertiserName || "Awin"), clickUrl: String(row.clickUrl), imageUrl: String(row.imageUrl || ""), syncedAt: new Date(String(row.syncedAt)).toISOString(), marketHint: `${row.currency || ""} ${row.title || ""} ${row.description || ""} ${row.advertiserName || ""}`.toLowerCase(),
    }));
    return [...dedicatedAwinProducts, ...genericProducts].slice(0, 500);
    } catch { return syncedProducts; }
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 140) || "cj-product";

export async function getSyncedCjProducts(): Promise<CjProduct[]> {
  const rows = await getSyncedAffiliateProducts();
  return rows.filter((row) => row.advertiserName && !row.advertiserName.toLowerCase().includes("awin"));
}

export async function syncCjProducts(input: CjSyncInput) {
  if (!input.apiToken.trim() || input.apiToken.trim().length < 8) return { ok: false, message: "A CJ Personal Access Token is required for Product Feed API calls.", products: [] as CjProduct[] } as const;
  if (!input.companyId.trim() || !input.pid.trim()) return { ok: false, message: "CJ Company ID and Promotional Property ID are required.", products: [] as CjProduct[] } as const;
  const query = `{ products(companyId: "${input.companyId.replace(/[^0-9]/g, "")}", keywords: "${(input.keyword || "beauty").replace(/[^a-zA-Z0-9 -]/g, "")}") { resultList { advertiserName id title description price { amount currency } linkCode(pid: "${input.pid.replace(/[^0-9]/g, "")}") { clickUrl } imageUrl } } }`;
  try {
    const response = await fetch("https://ads.api.cj.com/query", { method: "POST", headers: { Authorization: `Bearer ${input.apiToken.trim()}`, "Content-Type": "application/json" }, body: JSON.stringify({ query }) });
    const rawBody = await response.text();
    let payload: { data?: { products?: { resultList?: Array<any> } }; errors?: Array<{ message?: string }> } = {};
    if (rawBody.trim()) { try { payload = JSON.parse(rawBody); } catch { return { ok: false, message: `CJ Product Feed API returned HTTP ${response.status} with a non-JSON response. Check the endpoint, token, and CJ API access.`, products: [] as CjProduct[] } as const; } }
    if (!response.ok) return { ok: false, message: payload.errors?.map((error) => error.message).filter(Boolean).join("; ") || `CJ Product Feed API returned HTTP ${response.status}. Check the token, company ID, and advertiser relationships.`, products: [] as CjProduct[] } as const;
    if (payload.errors?.length) return { ok: false, message: payload.errors.map((error) => error.message).filter(Boolean).join("; ") || "CJ rejected the Product Feed request.", products: [] as CjProduct[] } as const;
    const rows = payload.data?.products?.resultList || [];
    const realRows = rows.filter((product) => product?.id && product?.title && product?.advertiserName && product?.linkCode?.clickUrl);
    const db = await getDb();
    const result: CjProduct[] = [];
    for (const product of realRows.slice(0, Math.min(input.limit || 12, 50))) {
      const item: CjProduct = { id: String(product.id), trackingToken: `cj:${String(product.id)}`, network: "cj", marketHint: `${product.price?.currency || ""} ${product.title || ""} ${product.description || ""} ${product.advertiserName || ""}`.toLowerCase(), title: String(product.title), description: String(product.description || ""), price: String(product.price?.amount || "View offer"), currency: String(product.price?.currency || ""), advertiserName: String(product.advertiserName), clickUrl: String(product.linkCode.clickUrl), imageUrl: String(product.imageUrl || product.image?.url || ""), syncedAt: new Date().toISOString() };
      if (db) {
        const productSlug = slugify(`cj-${item.id}`);
        const saved = await db.insert(products).values({ slug: productSlug, name: item.title.slice(0, 255), description: item.description.slice(0, 5000), category: "CJ Affiliate", productType: "affiliate", price: item.price === "View offer" ? null : item.price, currency: item.currency || "USD", imageUrl: item.imageUrl || null, destinationUrl: item.clickUrl, status: "active", availabilityStatus: "unknown", claimSafetyStatus: "needs_review", audienceFitScore: 0, profitabilityScore: 0, availabilityScore: 0, safetyScore: 0 }).onConflictDoUpdate({ target: products.slug, set: { name: item.title.slice(0, 255), description: item.description.slice(0, 5000), price: item.price === "View offer" ? null : item.price, currency: item.currency || "USD", imageUrl: item.imageUrl || null, destinationUrl: item.clickUrl, status: "active", updatedAt: new Date() } }).returning({ id: products.id });
        const productId = saved[0]?.id || (await db.select({ id: products.id }).from(products).where(eq(products.slug, productSlug)).limit(1))[0]?.id;
        if (productId) await upsertTrackedLink({ productId, token: `cj:${item.id}`, source: item.advertiserName, network: "cj", externalLinkId: item.id, campaign: input.keyword || "cj-products", destinationUrl: item.clickUrl, imageUrl: item.imageUrl || undefined });
      }
      result.push(item);
    }
    syncedProducts = result;
    return { ok: true, message: `Synced ${result.length} real product${result.length === 1 ? "" : "s"} from CJ Affiliate and saved them for refresh persistence.`, products: result } as const;
  } catch (error) { return { ok: false, message: error instanceof Error ? error.message : "CJ Product Feed request failed.", products: [] as CjProduct[] } as const; }
}
