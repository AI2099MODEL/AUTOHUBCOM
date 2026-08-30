import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { attributionEvents, orders, products } from "../drizzle/schema";
import { getDb } from "./db";

export async function getProductBySlug(slug: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result[0];
}

export async function createDirectOrder(input: { slug: string; customerName: string; customerEmail: string; consentGiven: boolean }) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  const product = await getProductBySlug(input.slug);
  if (!product || product.status !== "active" || product.productType !== "direct" || product.availabilityStatus !== "in_stock" || !product.price) throw new Error("Direct product is not currently available");
  const orderReference = `AC-${nanoid(10).toUpperCase()}`;
  const inserted = await db.insert(orders).values({ productId: product.id, orderReference, customerName: input.customerName.trim(), customerEmail: input.customerEmail.trim().toLowerCase(), amount: product.price, currency: product.currency, consentGiven: input.consentGiven }).returning({ id: orders.id });
  await db.insert(attributionEvents).values({ productId: product.id, platform: "storefront", eventType: "order", amount: product.price, externalReference: orderReference, consentGiven: input.consentGiven });
  return { orderReference, productId: product.id, amount: product.price, currency: product.currency, insertId: inserted[0]?.id };
}

export async function getAnalyticsSummary() {
  const db = await getDb(); if (!db) return { clicks: 0, outbound: 0, orders: 0, revenue: "0.00", byPlatform: [] };
  const [counts, revenue, byPlatform] = await Promise.all([
    db.select({ eventType: attributionEvents.eventType, total: sql<number>`count(*)` }).from(attributionEvents).groupBy(attributionEvents.eventType),
    db.select({ total: sql<string>`coalesce(sum(${attributionEvents.amount}), 0)` }).from(attributionEvents).where(eq(attributionEvents.eventType, "revenue")),
    db.select({ platform: attributionEvents.platform, total: sql<number>`count(*)` }).from(attributionEvents).groupBy(attributionEvents.platform),
  ]);
  const value = (kind: string) => Number(counts.find((row) => row.eventType === kind)?.total ?? 0);
  return { clicks: value("click"), outbound: value("outbound"), orders: value("order"), revenue: revenue[0]?.total ?? "0.00", byPlatform };
}
