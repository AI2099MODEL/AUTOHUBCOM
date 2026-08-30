import { eq, sql } from "drizzle-orm";
import { createCipheriv, createHash, randomBytes } from "node:crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { InsertUser, User, attributionEvents, contentPackages, products, users, trackedLinks, socialConnections } from "../drizzle/schema.js";
import { ENV } from "./_core/env.js";
import { getPostgresConnectionString } from "./_core/postgres.js";

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: Pool | null = null;
function encryptSecret(value?: string) { if (!value) return value; const key = createHash("sha256").update(process.env.JWT_SECRET || "brandjanra-token-key").digest(); const iv = randomBytes(12); const cipher = createCipheriv("aes-256-gcm", key, iv); const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]); return `v1:${iv.toString("base64url")}:${cipher.getAuthTag().toString("base64url")}:${encrypted.toString("base64url")}`; }

export async function getDb() {
  if (!_db && ENV.databaseUrl) {
    try {
      const protocol = new URL(ENV.databaseUrl).protocol;
      if (protocol !== "postgres:" && protocol !== "postgresql:") {
        console.warn("[Database] PostgreSQL driver requires a postgres:// DATABASE_URL; skipping legacy database URL.");
        return null;
      }
      _pool = new Pool({ connectionString: getPostgresConnectionString(ENV.databaseUrl), ssl: { rejectUnauthorized: false } });
      _db = drizzle(_pool); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; } else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onConflictDoUpdate({ target: users.openId, set: updateSet });
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getActiveProducts() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(products).where(eq(products.status, "active"));
}

export async function getContentPackages() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(contentPackages).orderBy(sql`${contentPackages.createdAt} desc`).limit(50);
}

export async function getAttributionSummary() {
  const db = await getDb(); if (!db) return [];
  return db.select({ platform: attributionEvents.platform, eventType: attributionEvents.eventType, total: sql<number>`count(*)` }).from(attributionEvents).groupBy(attributionEvents.platform, attributionEvents.eventType);
}

export async function upsertTrackedLink(input: { productId: number; token: string; source: string; network?: string; externalLinkId?: string; campaign: string; destinationUrl: string; imageUrl?: string; status?: "active" | "expired" | "paused" | "needs_review" }) {
  const db = await getDb(); if (!db) return undefined;
  const now = new Date();
  const existing = await db.select().from(trackedLinks).where(eq(trackedLinks.token, input.token)).limit(1);
  if (existing[0]) {
    await db.update(trackedLinks).set({ destinationUrl: input.destinationUrl, imageUrl: input.imageUrl, linkStatus: input.status || "active", lastSeenAt: now, lastCheckedAt: now, lastCheckError: null }).where(eq(trackedLinks.id, existing[0].id));
    return existing[0].id;
  }
  const result = await db.insert(trackedLinks).values({ productId: input.productId, token: input.token, source: input.source, network: input.network || "cj", externalLinkId: input.externalLinkId, campaign: input.campaign, destinationUrl: input.destinationUrl, imageUrl: input.imageUrl, linkStatus: input.status || "active", firstSeenAt: now, lastSeenAt: now, lastCheckedAt: now }).returning({ id: trackedLinks.id });
  return result[0]?.id;
}

export async function getTrackedLinkLifecycle() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(trackedLinks).orderBy(sql`${trackedLinks.lastSeenAt} desc`).limit(500);
}

export async function markTrackedLinkCheck(id: number, ok: boolean, error?: string) {
  const db = await getDb(); if (!db) return;
  await db.update(trackedLinks).set({ lastCheckedAt: new Date(), linkStatus: ok ? "active" : "expired", lastCheckError: ok ? null : (error || "Link check failed") }).where(eq(trackedLinks.id, id));
}

export async function saveSocialConnection(input: { platform: "meta" | "youtube"; accountId: string; accountName?: string; accessToken: string; refreshToken?: string; tokenExpiresAt?: Date; scopes?: string }) {
  const db = await getDb(); if (!db) return undefined;
  const existing = await db.select().from(socialConnections).where(eq(socialConnections.accountId, input.accountId)).limit(1);
  const safeInput = { ...input, accessToken: encryptSecret(input.accessToken)!, refreshToken: encryptSecret(input.refreshToken) };
  if (existing[0]) { await db.update(socialConnections).set({ ...safeInput, status: "connected" }).where(eq(socialConnections.id, existing[0].id)); return existing[0].id; }
  const result = await db.insert(socialConnections).values({ ...safeInput, status: "connected" }).returning({ id: socialConnections.id }); return result[0]?.id;
}

export async function getSocialConnections() {
  const db = await getDb(); if (!db) return [];
  try {
    return await db.select({ id: socialConnections.id, platform: socialConnections.platform, accountId: socialConnections.accountId, accountName: socialConnections.accountName, tokenExpiresAt: socialConnections.tokenExpiresAt, scopes: socialConnections.scopes, status: socialConnections.status, updatedAt: socialConnections.updatedAt }).from(socialConnections).orderBy(sql`${socialConnections.updatedAt} desc`);
  } catch (error) {
    console.warn("[Database] Social connections unavailable; returning an empty connection list.", error);
    return [];
  }
}
