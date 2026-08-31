import { eq } from "drizzle-orm";
import { products, trackedLinks } from "../drizzle/schema.js";
import { getDb } from "./db.js";

const affiliateHosts = new Set([
  "awin1.com",
  "kqzyfj.com",
  "tkqlhce.com",
  "dpbolvw.net",
  "anrdoezrs.net",
  "jdoqocy.com",
  "cj.com",
]);

const text = (value: unknown) => typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
const first = (...values: unknown[]) => values.map(text).find(Boolean) || "";
const absoluteUrl = (value: string, base: string) => {
  try {
    const url = new URL(value, base);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : "";
  } catch { return ""; }
};

function cleanHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function parseJsonLd(html: string) {
  const candidates: Array<Record<string, unknown>> = [];
  const matches = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || [];
  for (const block of matches) {
    const json = block.replace(/^.*?>/, "").replace(/<\/script>\s*$/i, "");
    try {
      const parsed = JSON.parse(json);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (item && typeof item === "object") candidates.push(item as Record<string, unknown>);
      }
    } catch { /* Ignore malformed structured data. */ }
  }
  const product = candidates.find((item) => {
    const type = item["@type"];
    return type === "Product" || (Array.isArray(type) && type.includes("Product"));
  });
  if (!product) return {};
  const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
  const offerRecord = offer && typeof offer === "object" ? offer as Record<string, unknown> : {};
  const brand = product.brand && typeof product.brand === "object" ? (product.brand as Record<string, unknown>).name : product.brand;
  return {
    title: text(product.name),
    description: text(product.description),
    imageUrl: Array.isArray(product.image) ? text(product.image[0]) : text(product.image),
    price: first(offerRecord.price, offerRecord.lowPrice),
    currency: first(offerRecord.priceCurrency),
    availability: text(offerRecord.availability).split("/").pop() || "",
    canonicalUrl: text(product.url),
    brand: text(brand),
  };
}

function meta(html: string, property: string) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i");
  return pattern.exec(html)?.[1] || "";
}

async function fetchWithTimeout(url: string, init: RequestInit = {}) {
  return fetch(url, { ...init, signal: AbortSignal.timeout(12000) });
}

async function resolveSellerPage(affiliateUrl: string) {
  let current = affiliateUrl;
  for (let hop = 0; hop < 3; hop++) {
    const parsed = new URL(current);
    if (!affiliateHosts.has(parsed.hostname.replace(/^www\./, ""))) return current;
    const response = await fetchWithTimeout(current, {
      headers: { Accept: "text/html,application/xhtml+xml", "User-Agent": "BrandJanraCatalog/1.0" },
      redirect: "manual",
    });
    if (response.status < 300 || response.status >= 400) return current;
    const location = response.headers.get("location");
    if (!location) return current;
    current = absoluteUrl(location, current);
    if (!current) return affiliateUrl;
  }
  return current;
}

export async function getProductDetails(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Catalog database is unavailable.");
  const rows = await db.select({
    token: trackedLinks.token,
    network: trackedLinks.network,
    source: trackedLinks.source,
    destinationUrl: trackedLinks.destinationUrl,
    productId: products.id,
    name: products.name,
    description: products.description,
    price: products.price,
    currency: products.currency,
    imageUrl: products.imageUrl,
    availabilityStatus: products.availabilityStatus,
  }).from(trackedLinks).innerJoin(products, eq(trackedLinks.productId, products.id)).where(eq(trackedLinks.token, token)).limit(1);
  const row = rows[0];
  if (!row) throw new Error("Product was not found.");

  let sellerUrl = row.destinationUrl;
  let page = {} as Record<string, string>;
  try {
    sellerUrl = await resolveSellerPage(row.destinationUrl);
    const response = await fetchWithTimeout(sellerUrl, { headers: { Accept: "text/html,application/xhtml+xml", "User-Agent": "BrandJanraCatalog/1.0" } });
    if (response.ok && (response.headers.get("content-type") || "").includes("text/html")) {
      const html = (await response.text()).slice(0, 2_000_000);
      const jsonLd = parseJsonLd(html) as Record<string, string>;
      page = {
        title: first(jsonLd.title, meta(html, "og:title"), meta(html, "twitter:title")),
        description: first(jsonLd.description, meta(html, "og:description"), meta(html, "description")),
        imageUrl: absoluteUrl(first(jsonLd.imageUrl, meta(html, "og:image"), meta(html, "twitter:image")), sellerUrl),
        price: first(jsonLd.price, meta(html, "product:price:amount")),
        currency: first(jsonLd.currency, meta(html, "product:price:currency")),
        availability: first(jsonLd.availability, meta(html, "product:availability")),
        canonicalUrl: absoluteUrl(first(jsonLd.canonicalUrl, meta(html, "og:url")), sellerUrl),
        brand: first(jsonLd.brand, meta(html, "product:brand")),
      };
    }
  } catch { /* Seller pages can block server-side previews; keep the synced catalog data. */ }

  return {
    token: row.token,
    network: row.network,
    source: row.source,
    productId: row.productId,
    title: first(page.title, row.name),
    description: first(page.description, row.description),
    price: first(page.price, row.price, ""),
    currency: first(page.currency, row.currency, "USD"),
    imageUrl: first(page.imageUrl, row.imageUrl, ""),
    availability: first(page.availability, row.availabilityStatus, "unknown"),
    sellerUrl,
    checkoutUrl: row.destinationUrl,
    sellerBrand: page.brand || row.source,
    fetchedFromSellerPage: Boolean(page.title || page.price || page.imageUrl),
  };
}
