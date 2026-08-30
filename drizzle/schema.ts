import { boolean, integer, index, numeric, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

const roleEnum = pgEnum("role", ["user", "admin"]);
const productTypeEnum = pgEnum("productType", ["affiliate", "direct"]);
const sourceTypeEnum = pgEnum("sourceType", ["affiliate", "supplier"]);
const statusEnum = pgEnum("status", ["draft", "active", "paused"]);
const availabilityStatusEnum = pgEnum("availabilityStatus", ["unknown", "in_stock", "out_of_stock"]);
const claimSafetyStatusEnum = pgEnum("claimSafetyStatus", ["needs_review", "approved", "blocked"]);
const linkStatusEnum = pgEnum("linkStatus", ["active", "expired", "paused", "needs_review"]);
const platformEnum = pgEnum("platform", ["meta", "youtube"]);
const socialStatusEnum = pgEnum("socialStatus", ["connected", "expired", "revoked", "needs_review"]);
const contentPlatformEnum = pgEnum("contentPlatform", ["instagram", "facebook", "youtube"]);
const contentStatusEnum = pgEnum("contentStatus", ["draft", "approved", "scheduled", "published", "blocked"]);
const integrationStatusEnum = pgEnum("integrationStatus", ["not_connected", "connected", "blocked", "manual_fallback"]);
const publishingStatusEnum = pgEnum("publishingStatus", ["queued", "running", "published", "failed", "paused"]);
const eventTypeEnum = pgEnum("eventType", ["click", "outbound", "order", "revenue"]);
const orderStatusEnum = pgEnum("orderStatus", ["pending", "paid", "fulfilled", "cancelled"]);
const socialPlatformEnum = pgEnum("socialPlatform", ["meta", "youtube"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum().default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  productType: productTypeEnum().notNull(),
  price: numeric("price", { precision: 12, scale: 2 }),
  currency: varchar("currency", { length: 8 }).default("USD").notNull(),
  imageUrl: text("imageUrl"),
  destinationUrl: text("destinationUrl"),
  status: statusEnum().default("draft").notNull(),
  availabilityStatus: availabilityStatusEnum().default("unknown").notNull(),
  claimSafetyStatus: claimSafetyStatusEnum().default("needs_review").notNull(),
  audienceFitScore: integer("audienceFitScore").default(0).notNull(),
  profitabilityScore: integer("profitabilityScore").default(0).notNull(),
  availabilityScore: integer("availabilityScore").default(0).notNull(),
  safetyScore: integer("safetyScore").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({ statusIdx: index("products_status_idx").on(table.status), typeIdx: index("products_type_idx").on(table.productType) }));

export const offerSources = pgTable("offer_sources", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  sourceType: sourceTypeEnum().notNull(),
  endpointUrl: text("endpointUrl").notNull(),
  enabled: boolean("enabled").default(false).notNull(),
  lastCheckedAt: timestamp("lastCheckedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  productId: integer("productId").notNull(),
  orderReference: varchar("orderReference", { length: 80 }).notNull().unique(),
  customerName: varchar("customerName", { length: 160 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  status: orderStatusEnum().default("pending").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 8 }).default("USD").notNull(),
  consentGiven: boolean("consentGiven").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const trackedLinks = pgTable("tracked_links", {
  id: serial("id").primaryKey(),
  productId: integer("productId").notNull(),
  token: varchar("token", { length: 80 }).notNull().unique(),
  source: varchar("source", { length: 80 }).notNull(),
  network: varchar("network", { length: 80 }).default("cj").notNull(),
  externalLinkId: varchar("externalLinkId", { length: 180 }),
  campaign: varchar("campaign", { length: 120 }).notNull(),
  destinationUrl: text("destinationUrl").notNull(),
  imageUrl: text("imageUrl"),
  linkStatus: linkStatusEnum().default("active").notNull(),
  firstSeenAt: timestamp("firstSeenAt").defaultNow().notNull(),
  lastSeenAt: timestamp("lastSeenAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
  lastCheckedAt: timestamp("lastCheckedAt"),
  lastCheckError: text("lastCheckError"),
  clickCount: integer("clickCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ productIdx: index("tracked_links_product_idx").on(table.productId), lifecycleIdx: index("tracked_links_lifecycle_idx").on(table.network, table.linkStatus, table.lastCheckedAt) }));

export const socialConnections = pgTable("social_connections", {
  id: serial("id").primaryKey(),
  platform: socialPlatformEnum().notNull(),
  accountId: varchar("accountId", { length: 180 }).notNull(),
  accountName: varchar("accountName", { length: 255 }),
  accessToken: text("accessToken").notNull(),
  refreshToken: text("refreshToken"),
  tokenExpiresAt: timestamp("tokenExpiresAt"),
  scopes: text("scopes"),
  status: socialStatusEnum().default("connected").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({ platformIdx: index("social_connections_platform_idx").on(table.platform, table.status) }));

export const contentPackages = pgTable("content_packages", {
  id: serial("id").primaryKey(),
  productId: integer("productId").notNull(),
  platform: contentPlatformEnum().notNull(),
  title: varchar("title", { length: 255 }),
  caption: text("caption"),
  script: text("script"),
  callToAction: varchar("callToAction", { length: 255 }),
  disclosure: text("disclosure").notNull(),
  trackingUrl: text("trackingUrl"),
  status: contentStatusEnum().default("draft").notNull(),
  scheduledAt: timestamp("scheduledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ productPlatformIdx: index("content_product_platform_idx").on(table.productId, table.platform) }));

export const publishingJobs = pgTable("publishing_jobs", {
  id: serial("id").primaryKey(),
  contentPackageId: integer("contentPackageId").notNull(),
  platform: contentPlatformEnum().notNull(),
  integrationStatus: integrationStatusEnum().default("not_connected").notNull(),
  status: publishingStatusEnum().default("queued").notNull(),
  retryCount: integer("retryCount").default(0).notNull(),
  lastError: text("lastError"),
  scheduledAt: timestamp("scheduledAt"),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const attributionEvents = pgTable("attribution_events", {
  id: serial("id").primaryKey(),
  productId: integer("productId").notNull(),
  contentPackageId: integer("contentPackageId"),
  platform: varchar("platform", { length: 80 }).notNull(),
  eventType: eventTypeEnum().notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }),
  externalReference: varchar("externalReference", { length: 180 }),
  consentGiven: boolean("consentGiven").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ eventIdx: index("attribution_events_event_idx").on(table.eventType, table.platform) }));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type ContentPackage = typeof contentPackages.$inferSelect;
export type InsertContentPackage = typeof contentPackages.$inferInsert;
export type OfferSource = typeof offerSources.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type TrackedLink = typeof trackedLinks.$inferSelect;
export type SocialConnection = typeof socialConnections.$inferSelect;
