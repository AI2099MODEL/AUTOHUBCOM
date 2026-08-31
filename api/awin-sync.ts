import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";
import { gunzipSync } from "node:zlib";

const getDatabaseUrl = () => process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.SUPABASE_DB_URL || "";
const getConnectionString = (raw: string) => { try { const url = new URL(raw.replace(/^postgresql:\/\//, "postgres://")); ["sslmode", "sslcert", "sslkey", "sslrootcert"].forEach((key) => url.searchParams.delete(key)); return url.toString(); } catch { return raw.replace(/^postgresql:\/\//, "postgres://"); } };
const ensureAwinTables = async (pool: Pool) => {
  await pool.query(`CREATE TABLE IF NOT EXISTS awin_products (id BIGSERIAL PRIMARY KEY, external_id VARCHAR(180) NOT NULL UNIQUE, slug VARCHAR(220) NOT NULL UNIQUE, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, category VARCHAR(160) NOT NULL, price NUMERIC(12,2), currency VARCHAR(8) NOT NULL DEFAULT 'USD', image_url TEXT, click_url TEXT NOT NULL, advertiser_id BIGINT, advertiser_name VARCHAR(255), locale VARCHAR(20), status VARCHAR(30) NOT NULL DEFAULT 'active', first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  await pool.query(`CREATE TABLE IF NOT EXISTS awin_tracked_links (id BIGSERIAL PRIMARY KEY, awin_product_id BIGINT NOT NULL, token VARCHAR(180) NOT NULL UNIQUE, external_link_id VARCHAR(180), destination_url TEXT NOT NULL, image_url TEXT, link_status VARCHAR(30) NOT NULL DEFAULT 'active', first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), last_checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), expires_at TIMESTAMPTZ, last_check_error TEXT)`);
};

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

function extractCsvUrl(line: string) {
  return line.match(/https?:\/\/[^,\s"']+/i)?.[0]?.replace(/["']+$/g, "") || "";
}

async function fetchFeedFromList(feedApiKey: string, advertiserId: number, locale: string) {
  const listUrl = process.env.AWIN_PRODUCT_FEED_LIST_URL || `https://productdata.awin.com/datafeed/list/apikey/${encodeURIComponent(feedApiKey)}`;
  const response = await fetch(listUrl, { headers: { Accept: "text/csv, text/plain, */*", "User-Agent": "BrandJanraSync/1.0" } });
  if (!response.ok) throw new Error(`Awin product-feed list returned HTTP ${response.status}`);
  const raw = await response.text();
  const wantedId = String(advertiserId);
  const wantedLocale = locale.toLowerCase();
  const candidates: string[] = [];
  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim() || line.toLowerCase().startsWith("advertiser id")) continue;
    const fields = parseCsvLine(line);
    const normalized = line.toLowerCase();
    const membership = text(fields[3]).toLowerCase();
    const language = text(fields[7]).toLowerCase();
    if (!normalized.includes(wantedId) || (!language && !normalized.includes(wantedLocale))) continue;
    if (membership && !["joined", "active"].includes(membership)) continue;
    const url = extractCsvUrl(line);
    if (url) candidates.push(url);
  }
  return candidates.find((url) => /productdata\.awin\.com/i.test(url)) || candidates[0] || "";
}

async function fetchProgrammes(publisherId: string, token: string): Promise<Programme[]> {
  const url = `https://api.awin.com/publishers/${encodeURIComponent(publisherId)}/programmes?relationship=joined`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
  const raw = await response.text();
  if (!response.ok) throw new Error(`Awin programme discovery failed with HTTP ${response.status}: ${raw.slice(0, 180)}`);
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed.filter((p): p is Programme => Number.isFinite(Number(p?.id))) : [];
}

let directFeedCache: { url: string; products: FeedProduct[] } | undefined;

function parseCsvLine(line: string) {
  const values: string[] = []; let current = ""; let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"' && quoted) { current += '"'; i++; continue; }
    if (char === '"') { quoted = !quoted; continue; }
    if (char === ',' && !quoted) { values.push(current.trim()); current = ""; continue; }
    current += char;
  }
  values.push(current.trim());
  return values;
}

function normalizeFeedProduct(raw: FeedProduct): FeedProduct {
  const sections = Object.values(raw).filter((value): value is FeedProduct => Boolean(value && typeof value === "object" && !Array.isArray(value)));
  const flattened = sections.reduce<FeedProduct>((product, section) => ({ ...product, ...section }), { ...raw });
  return {
    ...flattened,
    id: flattened.id || flattened.aw_product_id || flattened.merchant_product_id || flattened.gtin || flattened.mpn,
    title: flattened.title || flattened.product_name || flattened.name,
    description: flattened.description || flattened.product_description,
    link: flattened.link || flattened.aw_deep_link || flattened.merchant_deep_link || flattened.product_url,
    image_link: flattened.image_link || flattened.merchant_image_url || flattened.aw_image_url || flattened.imageUrl,
    price: flattened.price || flattened.display_price || flattened.search_price || flattened.store_price || flattened.sale_price,
    merchant_id: flattened.merchant_id || flattened.advertiser_id,
    merchant_name: flattened.merchant_name || flattened.advertiser_name,
    product_type: flattened.product_type || flattened.merchant_category || flattened.category_name,
  };
}

function isFeedRecord(value: unknown): value is FeedProduct {
  if (!value || typeof value !== "object") return false;
  const item = value as FeedProduct;
  return !item.error && Boolean(item.id || item.title || item.product_name || item.link || item.product_basic || item.product_details);
}

function parseFeedPayload(raw: string): FeedProduct[] {
  try {
    const parsed = JSON.parse(raw);
    const candidates = Array.isArray(parsed)
      ? parsed
      : ["products", "data", "items", "results", "feed"].flatMap((key) => Array.isArray(parsed?.[key]) ? parsed[key] : []);
    if (candidates.length) return candidates.filter(isFeedRecord).map(normalizeFeedProduct);
  } catch { /* Fall through to JSONL parsing. */ }
  return raw.split(/\r?\n/).filter((line) => line.trim()).flatMap((line) => {
    try {
      const item = JSON.parse(line);
      return isFeedRecord(item) ? [normalizeFeedProduct(item)] : [];
    } catch { return []; }
  });
}

async function fetchDirectCsvFeed(feedUrl: string, advertiserId: number) {
  if (directFeedCache?.url === feedUrl) {
    const products = advertiserId > 0 ? directFeedCache.products.filter((product) => !text(product.merchant_id) || text(product.merchant_id) === String(advertiserId)) : directFeedCache.products;
    return { products, skipped: false, reason: "" };
  }
  const response = await fetch(feedUrl, { headers: { Accept: "application/gzip, text/csv, */*", "User-Agent": "BrandJanraSync/1.0" } });
  if (!response.ok) return { products: [] as FeedProduct[], skipped: true, reason: `HTTP ${response.status}` };
  const bytes = Buffer.from(await response.arrayBuffer());
  const contentEncoding = (response.headers.get("content-encoding") || "").toLowerCase();
  const rawBytes = contentEncoding.includes("gzip") || bytes[0] === 0x1f && bytes[1] === 0x8b ? gunzipSync(bytes) : bytes;
  const rows = rawBytes.toString("utf8").split(/\r?\n/).filter(Boolean);
  if (!rows.length) return { products: [] as FeedProduct[], skipped: true, reason: "Empty Awin CSV feed" };
  const headers = parseCsvLine(rows[0]).map((header) => header.toLowerCase());
  const products: FeedProduct[] = [];
  for (const row of rows.slice(1)) {
    const values = parseCsvLine(row); const item: FeedProduct = {};
    headers.forEach((header, index) => { item[header] = values[index] || ""; });
    const merchantId = text(item.merchant_id);
    if (merchantId && merchantId !== String(advertiserId)) continue;
    products.push({
      id: item.aw_product_id || item.merchant_product_id,
      title: item.product_name,
      description: item.description,
      link: item.aw_deep_link || item.merchant_deep_link,
      image_link: item.merchant_image_url || item.aw_image_url,
      price: item.display_price || item.search_price || item.store_price,
      currency: item.currency,
      merchant_name: item.merchant_name,
      merchant_id: merchantId,
      availability: "in_stock",
      product_type: item.merchant_category || item.category_name,
    });
  }
  directFeedCache = { url: feedUrl, products };
  return { products: advertiserId > 0 ? products.filter((product) => !text(product.merchant_id) || text(product.merchant_id) === String(advertiserId)) : products, skipped: false, reason: "" };
}

async function fetchFeed(publisherId: string, advertiserId: number, token: string, locale: string, feedApiKey = "", directFeedUrl = "") {
  if (directFeedUrl) return fetchDirectCsvFeed(directFeedUrl, advertiserId);
  let url = "";
  if (feedApiKey) {
    try { url = await fetchFeedFromList(feedApiKey, advertiserId, locale); }
    catch (error) { return { products: [] as FeedProduct[], skipped: true, reason: error instanceof Error ? error.message : "Product-feed list request failed" }; }
    if (!url) return { products: [] as FeedProduct[], skipped: true, reason: `No accessible product feed for advertiser ${advertiserId} and locale ${locale}` };
    if (/productdata\.awin\.com|\.csv(?:\.gz)?(?:$|\?)/i.test(url)) return fetchDirectCsvFeed(url, advertiserId);
  } else {
    url = `https://api.awin.com/publishers/${encodeURIComponent(publisherId)}/awinfeeds/download/${advertiserId}-retail-${locale}.jsonl`;
  }
  let response: Response | undefined;
  for (let attempt = 0; attempt < 3; attempt++) {
    response = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: "application/jsonl, application/json, */*", "User-Agent": "BrandJanraSync/1.0" } });
    if (response.status !== 406 || response.ok || attempt === 2) break;
    await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
  }
  if (!response || !response.ok) return { products: [] as FeedProduct[], skipped: true, reason: `HTTP ${response?.status || 502}` };
  const raw = await response.text();
  const lines = raw.split(/\r?\n/).filter((line) => line.trim());
  const diagnosticKeys = lines.slice(0, 2).flatMap((line) => {
    try { const value = JSON.parse(line); return value && typeof value === "object" ? Object.keys(value).slice(0, 20) : []; } catch { return []; }
  });
  return { products: parseFeedPayload(raw), skipped: false, reason: "", diagnostic: { status: response.status, contentType: response.headers.get("content-type") || "", bytes: raw.length, lines: lines.length, keys: [...new Set(diagnosticKeys)] } };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "POST") return res.status(405).json({ ok: false, message: "Use GET or POST." });
  const expected = process.env.CRON_SECRET;
  if (expected && String(req.headers.authorization || "") !== `Bearer ${expected}`) return res.status(401).json({ ok: false, message: "Unauthorized." });
  const publisherId = process.env.AWIN_PUBLISHER_ID || "3064649";
  const token = process.env.AWIN_PUBLISHER_API_TOKEN || process.env.AWIN_API_TOKEN || process.env.AWIN_API_TOKEN_VALUE || "";
  const feedApiKey = process.env.AWIN_PRODUCT_FEED_API_KEY || process.env.AWIN_FEED_API_KEY || "";
  const feedListUrl = process.env.AWIN_PRODUCT_FEED_LIST_URL || "";
  const configuredDirectFeedUrl = process.env.AWIN_PRODUCT_FEED_URL || process.env.AWIN_FEED_URL || "";
  const directFeedUrl = /productdata\.awin\.com\/datafeed\/download\//i.test(configuredDirectFeedUrl) ? configuredDirectFeedUrl : /productdata\.awin\.com\/datafeed\/download\//i.test(feedListUrl) ? feedListUrl : "";
  const configuredAdvertiserIds = String(process.env.AWIN_ADVERTISER || process.env.AWIN_ADVERTISER_IDS || "").split(/[\s,;|]+/).map((value) => Number(value)).filter((value) => Number.isInteger(value) && value > 0);
  const databaseUrl = getDatabaseUrl();
  if (!token && !directFeedUrl && !feedApiKey && !feedListUrl) return res.status(503).json({ ok: false, message: "Awin sync is not configured. Add an Awin product-feed URL, feed-list URL/API key, or publisher API token in the production environment." });
  if (!databaseUrl) return res.status(503).json({ ok: false, message: "Awin sync requires a PostgreSQL database connection." });

  const requestedLocale = String((req.body as any)?.locale || (req.query as any)?.locale || "").trim();
  const configuredLocales = (requestedLocale || process.env.AWIN_FEED_LOCALES || process.env.AWIN_FEED_LOCALE || "en_GB").split(/[\s,;|]+/).map((value) => value.trim()).filter(Boolean).slice(0, 12);
  const locales = directFeedUrl ? [configuredLocales[0] || "en_GB"] : configuredLocales;
  const configuredProductLimit = Number((req.body as any)?.limit || (req.query as any)?.limit || process.env.AWIN_PRODUCTS_PER_ADVERTISER || 0);
  const maxProductsPerAdvertiser = Number.isFinite(configuredProductLimit) && configuredProductLimit > 0 ? configuredProductLimit : Number.POSITIVE_INFINITY;
  const pool = new Pool({ connectionString: getConnectionString(databaseUrl), ssl: { rejectUnauthorized: false }, max: 2 });
  try {
    await ensureAwinTables(pool);
    const programmes = token ? await fetchProgrammes(publisherId, token) : [];
    const activeProgrammes = programmes.filter((p) => String(p.status || "active").toLowerCase() === "active");
    const selected = configuredAdvertiserIds.length
      ? configuredAdvertiserIds.map((id) => activeProgrammes.find((programme) => Number(programme.id) === id) || ({ id, name: `Awin advertiser ${id}`, status: "active" } as Programme))
      : directFeedUrl || feedApiKey || feedListUrl
        ? [{ id: 0, name: "Awin product feed list", status: "active" } as Programme]
        : activeProgrammes;
    let imported = 0; let advertisersWithFeeds = 0; let skippedFeeds = 0;
    const storefrontProducts: Array<{ id: string; title: string; description: string; price: string; currency: string; advertiserName: string; clickUrl: string; imageUrl: string }> = [];
    const advertiserResults: Array<{ id: number; name: string; locale: string; imported: number; feed: string; diagnostic?: { status: number; contentType: string; bytes: number; lines: number; keys: string[] } }> = [];

    for (const locale of locales) {
      for (const programme of selected) {
        const advertiserId = Number(programme.id);
        const feed = await fetchFeed(publisherId, advertiserId, token, locale, feedApiKey || feedListUrl, directFeedUrl);
        const feedProducts = feed.products;
        const feedStatus = feed.reason;
        if (feed.skipped) { skippedFeeds++;         advertiserResults.push({ id: advertiserId, name: text(programme.name, `Awin advertiser ${advertiserId}`), locale, imported: 0, feed: feed.reason, diagnostic: feed.diagnostic }); continue; }
        if (feedProducts.length) advertisersWithFeeds++;
        let advertiserImported = 0;
        for (const product of feedProducts.slice(0, maxProductsPerAdvertiser)) {
          const externalId = text(product.id || product.gtin || product.mpn);
          const destination = firstUrl(product.link, product.mobile_link);
          const title = text(product.title || product.name, `Awin product ${externalId || "item"}`);
          const imageUrl = firstUrl(product.image_link, product.imageUrl);
          if (!externalId || !destination || !imageUrl) continue;
          const productAdvertiserId = Number(text(product.merchant_id)) || advertiserId;
          if (!productAdvertiserId) continue;
          const productSlug = slugify(`awin-${productAdvertiserId}-${locale}-${externalId}`);
          const clickUrl = affiliateUrl(publisherId, productAdvertiserId, destination);
          const price = parsePrice(product.sale_price || product.price);
          const currency = parseCurrency(product.sale_price || product.price, text(programme.currencyCode, "USD"));
          const description = text(product.description, `${title} from ${text(programme.name, "an Awin advertiser")}.` ).slice(0, 5000);
          const category = categoryFrom(product);
          const productResult = await pool.query<{ id: number }>(`INSERT INTO awin_products (external_id, slug, title, description, category, price, currency, image_url, click_url, advertiser_id, advertiser_name, locale, status, last_seen_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'active',NOW(),NOW()) ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, category=EXCLUDED.category, price=EXCLUDED.price, currency=EXCLUDED.currency, image_url=EXCLUDED.image_url, click_url=EXCLUDED.click_url, advertiser_id=EXCLUDED.advertiser_id, advertiser_name=EXCLUDED.advertiser_name, locale=EXCLUDED.locale, status='active', last_seen_at=NOW(), updated_at=NOW() RETURNING id`, [externalId, productSlug, title.slice(0, 255), description, category, price, currency, imageUrl, clickUrl, productAdvertiserId, text(product.merchant_name || programme.name, `Awin ${productAdvertiserId}`).slice(0, 255), locale]);
          const productId = productResult.rows[0]?.id;
          if (!productId) continue;
          await pool.query(`INSERT INTO awin_tracked_links (awin_product_id, token, external_link_id, destination_url, image_url, link_status, last_seen_at, last_checked_at, last_check_error) VALUES ($1,$2,$3,$4,$5,'active',NOW(),NOW(),NULL) ON CONFLICT (token) DO UPDATE SET awin_product_id=EXCLUDED.awin_product_id, destination_url=EXCLUDED.destination_url, image_url=EXCLUDED.image_url, link_status='active', last_seen_at=NOW(), last_checked_at=NOW(), last_check_error=NULL`, [productId, `awin:${productAdvertiserId}:${locale}:${externalId}`, externalId.slice(0, 180), clickUrl, imageUrl]);
          storefrontProducts.push({ id: `awin:${productAdvertiserId}:${locale}:${externalId}`, title: title.slice(0, 255), description, price: price || "View offer", currency, advertiserName: text(product.merchant_name || programme.name, `Awin ${productAdvertiserId}`), clickUrl, imageUrl });
          imported++; advertiserImported++;
        }
        advertiserResults.push({ id: advertiserId, name: text(programme.name, `Awin advertiser ${advertiserId}`), locale, imported: advertiserImported, feed: feedStatus || "ok", diagnostic: feed.diagnostic });
      }
    }
    return res.status(200).json({ ok: imported > 0, message: imported > 0 ? `Imported ${imported} Awin products into the Awin catalog.` : "Awin feeds were reached but no usable products were imported.", publisherId, locales, configuredAdvertiserIds, advertisersDiscovered: selected.length, advertisersWithFeeds, skippedFeeds, productsImported: imported, products: storefrontProducts, advertisers: advertiserResults });
  } catch (error) {
    return res.status(502).json({ ok: false, message: error instanceof Error ? error.message : "Awin synchronization failed." });
  } finally { await pool.end(); }
}

export { fetchProgrammes, fetchFeed, fetchFeedFromList, fetchDirectCsvFeed, affiliateUrl };

// This endpoint intentionally never returns or logs the Awin token.
// Product feeds are processed sequentially to respect Awin's feed request limits.
