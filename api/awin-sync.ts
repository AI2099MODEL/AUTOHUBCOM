import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

const getDatabaseUrl = () => process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.SUPABASE_DB_URL || "";
const getConnectionString = (raw: string) => { try { const url = new URL(raw.replace(/^postgresql:\/\//, "postgres://")); ["sslmode", "sslcert", "sslkey", "sslrootcert"].forEach((key) => url.searchParams.delete(key)); return url.toString(); } catch { return raw.replace(/^postgresql:\/\//, "postgres://"); } };

type Programme = { id: number; name?: string; status?: string; currencyCode?: string; primaryRegion?: { countryCode?: string } };
type FeedProduct = Record<string, unknown>;
const text = (value: unknown, fallback = "") => typeof value === "string" ? value.trim() : value == null ? fallback : String(value).trim();
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 110) || "awin-product";
const firstUrl = (...values: unknown[]) => values.map((v) => text(v)).find((v) => /^https?:\/\//i.test(v)) || "";
const parsePrice = (value: unknown) => { const match = text(value).match(/[0-9]+(?:[.,][0-9]+)?/); return match ? match[0].replace(",", ".") : null; };
const parseCurrency = (value: unknown, fallback: string) => { const match = text(value).match(/[A-Z]{3}/); return match?.[0] || fallback || "USD"; };
const categoryFrom = (p: FeedProduct) => text(p.google_product_category || p.product_type || p.category || "Awin affiliate").split(">" )[0].trim().slice(0, 120) || "Awin affiliate";

function affiliateUrl(publisherId: string, advertiserId: number, destination: string) {
  return `https://www.awin1.com/cread.php?awinmid=${advertiserId}&awinaffid=${encodeURIComponent(publisherId)}&ued=${encodeURIComponent(destination)}`;
}

async function fetchProgrammes(publisherId: string, token: string): Promise<Programme[]> {
  const url = `https://api.awin.com/publishers/${encodeURIComponent(publisherId)}/programmes?relationship=joined`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
  const raw = await response.text();
  if (!response.ok) throw new Error(`Awin programme discovery failed with HTTP ${response.status}: ${raw.slice(0, 180)}`);
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed.filter((p): p is Programme => Number.isFinite(Number(p?.id))) : [];
}

async function fetchFeed(publisherId: string, advertiserId: number, token: string, locale: string) {
  const url = `https://api.awin.com/publishers/${encodeURIComponent(publisherId)}/awinfeeds/download/${advertiserId}-retail-${locale}.jsonl`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: "*/*" } });
  if (!response.ok) return { products: [] as FeedProduct[], skipped: true, reason: `HTTP ${response.status}` };
  const raw = await response.text();
  const products: FeedProduct[] = [];
  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      const item = JSON.parse(line);
      if (item && typeof item === "object" && !item.error && !item.meta) products.push(item);
    } catch { /* Ignore malformed lines; Awin feeds are JSONL and may include a terminal status line. */ }
  }
  return { products, skipped: false, reason: "" };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "POST") return res.status(405).json({ ok: false, message: "Use GET or POST." });
  const expected = process.env.CRON_SECRET;
  if (expected && String(req.headers.authorization || "") !== `Bearer ${expected}`) return res.status(401).json({ ok: false, message: "Unauthorized." });
  const publisherId = process.env.AWIN_PUBLISHER_ID || "3064649";
  const token = process.env.AWIN_PUBLISHER_API_TOKEN || process.env.AWIN_API_TOKEN || process.env.AWIN_API_TOKEN_VALUE || "";
  const configuredAdvertiserIds = String(process.env.AWIN_ADVERTISER || "").split(/[\s,;|]+/).map((value) => Number(value)).filter((value) => Number.isInteger(value) && value > 0);
  const databaseUrl = getDatabaseUrl();
  if (!token) return res.status(503).json({ ok: false, message: "Awin sync is not configured. Add AWIN_PUBLISHER_API_TOKEN in the production environment." });
  if (!databaseUrl) return res.status(503).json({ ok: false, message: "Awin sync requires a PostgreSQL database connection." });

  const locale = String((req.body as any)?.locale || process.env.AWIN_FEED_LOCALE || "en_GB");
  const maxProductsPerAdvertiser = Math.min(Math.max(Number((req.body as any)?.limit || process.env.AWIN_PRODUCTS_PER_ADVERTISER || 100), 1), 500);
  const pool = new Pool({ connectionString: getConnectionString(databaseUrl), ssl: { rejectUnauthorized: false }, max: 2 });
  try {
    const programmes = await fetchProgrammes(publisherId, token);
    const activeProgrammes = programmes.filter((p) => String(p.status || "active").toLowerCase() === "active");
    const selected = configuredAdvertiserIds.length
      ? configuredAdvertiserIds.map((id) => activeProgrammes.find((programme) => Number(programme.id) === id) || ({ id, name: `Awin advertiser ${id}`, status: "active" } as Programme))
      : activeProgrammes;
    let imported = 0; let advertisersWithFeeds = 0; let skippedFeeds = 0;
    const advertiserResults: Array<{ id: number; name: string; imported: number; feed: string }> = [];

    for (const programme of selected) {
      const advertiserId = Number(programme.id);
      const feed = await fetchFeed(publisherId, advertiserId, token, locale);
      const feedProducts = feed.products;
      const feedStatus = feed.reason;
      if (feed.skipped) { skippedFeeds++; advertiserResults.push({ id: advertiserId, name: text(programme.name, `Awin advertiser ${advertiserId}`), imported: 0, feed: feed.reason }); continue; }
      if (feedProducts.length) advertisersWithFeeds++;
      let advertiserImported = 0;
      for (const product of feedProducts.slice(0, maxProductsPerAdvertiser)) {
        const externalId = text(product.id || product.gtin || product.mpn);
        const destination = firstUrl(product.link, product.mobile_link);
        const title = text(product.title || product.name, `Awin product ${externalId || "item"}`);
        const imageUrl = firstUrl(product.image_link, product.imageUrl);
        if (!externalId || !destination || !imageUrl) continue;
        const productSlug = slugify(`awin-${advertiserId}-${externalId}`);
        const clickUrl = affiliateUrl(publisherId, advertiserId, destination);
        const price = parsePrice(product.sale_price || product.price);
        const currency = parseCurrency(product.sale_price || product.price, text(programme.currencyCode, "USD"));
        const description = text(product.description, `${title} from ${text(programme.name, "an Awin advertiser")}.` ).slice(0, 5000);
        const category = categoryFrom(product);
        const productResult = await pool.query<{ id: number }>(`INSERT INTO products (slug, name, description, category, "productType", price, currency, "imageUrl", "destinationUrl", status, "availabilityStatus", "claimSafetyStatus", "audienceFitScore", "profitabilityScore", "availabilityScore", "safetyScore", "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,'affiliate',$5,$6,$7,$8,'active',$9,'needs_review',0,0,0,0,NOW(),NOW()) ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description, category=EXCLUDED.category, price=EXCLUDED.price, currency=EXCLUDED.currency, "imageUrl"=EXCLUDED."imageUrl", "destinationUrl"=EXCLUDED."destinationUrl", "updatedAt"=NOW() RETURNING id`, [productSlug, title.slice(0, 255), description, category, price, currency, imageUrl, clickUrl, text(product.availability).toLowerCase() === "out_of_stock" ? "out_of_stock" : "in_stock"]);
        const productId = productResult.rows[0]?.id;
        if (!productId) continue;
        await pool.query(`INSERT INTO tracked_links ("productId", token, source, network, "externalLinkId", campaign, "destinationUrl", "imageUrl", "linkStatus", "firstSeenAt", "lastSeenAt", "lastCheckedAt") VALUES ($1,$2,$3,'awin',$4,$5,$6,$7,'active',NOW(),NOW(),NOW()) ON CONFLICT (token) DO UPDATE SET "productId"=EXCLUDED."productId", "destinationUrl"=EXCLUDED."destinationUrl", "imageUrl"=EXCLUDED."imageUrl", "linkStatus"='active', "lastSeenAt"=NOW(), "lastCheckedAt"=NOW(), "lastCheckError"=NULL`, [productId, `awin:${advertiserId}:${externalId}`, text(programme.name, `Awin ${advertiserId}`).slice(0, 80), externalId.slice(0, 180), `awin-${advertiserId}`, clickUrl, imageUrl]);
        imported++; advertiserImported++;
      }
      advertiserResults.push({ id: advertiserId, name: text(programme.name, `Awin advertiser ${advertiserId}`), imported: advertiserImported, feed: feedStatus || "ok" });
    }
    return res.status(200).json({ ok: true, publisherId, locale, configuredAdvertiserIds, advertisersDiscovered: selected.length, advertisersWithFeeds, skippedFeeds, productsImported: imported, advertisers: advertiserResults });
  } catch (error) {
    return res.status(502).json({ ok: false, message: error instanceof Error ? error.message : "Awin synchronization failed." });
  } finally { await pool.end(); }
}

export { fetchProgrammes, fetchFeed, affiliateUrl };

// This endpoint intentionally never returns or logs the Awin token.
// Product feeds are processed sequentially to respect Awin's feed request limits.
