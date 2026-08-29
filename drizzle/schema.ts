import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, index } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  productType: mysqlEnum("productType", ["affiliate", "direct"]).notNull(),
  price: decimal("price", { precision: 12, scale: 2 }),
  currency: varchar("currency", { length: 8 }).default("USD").notNull(),
  imageUrl: text("imageUrl"),
  destinationUrl: text("destinationUrl"),
  status: mysqlEnum("status", ["draft", "active", "paused"]).default("draft").notNull(),
  availabilityStatus: mysqlEnum("availabilityStatus", ["unknown", "in_stock", "out_of_stock"]).default("unknown").notNull(),
  claimSafetyStatus: mysqlEnum("claimSafetyStatus", ["needs_review", "approved", "blocked"]).default("needs_review").notNull(),
  audienceFitScore: int("audienceFitScore").default(0).notNull(),
  profitabilityScore: int("profitabilityScore").default(0).notNull(),
  availabilityScore: int("availabilityScore").default(0).notNull(),
  safetyScore: int("safetyScore").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ statusIdx: index("products_status_idx").on(table.status), typeIdx: index("products_type_idx").on(table.productType) }));

export const offerSources = mysqlTable("offer_sources", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  sourceType: mysqlEnum("sourceType", ["affiliate", "supplier"]).notNull(),
  endpointUrl: text("endpointUrl").notNull(),
  enabled: boolean("enabled").default(false).notNull(),
  lastCheckedAt: timestamp("lastCheckedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  orderReference: varchar("orderReference", { length: 80 }).notNull().unique(),
  customerName: varchar("customerName", { length: 160 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  status: mysqlEnum("status", ["pending", "paid", "fulfilled", "cancelled"]).default("pending").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 8 }).default("USD").notNull(),
  consentGiven: boolean("consentGiven").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const trackedLinks = mysqlTable("tracked_links", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  token: varchar("token", { length: 80 }).notNull().unique(),
  source: varchar("source", { length: 80 }).notNull(),
  network: varchar("network", { length: 80 }).default("cj").notNull(),
  externalLinkId: varchar("externalLinkId", { length: 180 }),
  campaign: varchar("campaign", { length: 120 }).notNull(),
  destinationUrl: text("destinationUrl").notNull(),
  imageUrl: text("imageUrl"),
  linkStatus: mysqlEnum("linkStatus", ["active", "expired", "paused", "needs_review"]).default("active").notNull(),
  firstSeenAt: timestamp("firstSeenAt").defaultNow().notNull(),
  lastSeenAt: timestamp("lastSeenAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
  lastCheckedAt: timestamp("lastCheckedAt"),
  lastCheckError: text("lastCheckError"),
  clickCount: int("clickCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ productIdx: index("tracked_links_product_idx").on(table.productId), lifecycleIdx: index("tracked_links_lifecycle_idx").on(table.network, table.linkStatus, table.lastCheckedAt) }));

export const socialConnections = mysqlTable("social_connections", {
  id: int("id").autoincrement().primaryKey(),
  platform: mysqlEnum("platform", ["meta", "youtube"]).notNull(),
  accountId: varchar("accountId", { length: 180 }).notNull(),
  accountName: varchar("accountName", { length: 255 }),
  accessToken: text("accessToken").notNull(),
  refreshToken: text("refreshToken"),
  tokenExpiresAt: timestamp("tokenExpiresAt"),
  scopes: text("scopes"),
  status: mysqlEnum("status", ["connected", "expired", "revoked", "needs_review"]).default("connected").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ platformIdx: index("social_connections_platform_idx").on(table.platform, table.status) }));

export const contentPackages = mysqlTable("content_packages", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  platform: mysqlEnum("platform", ["instagram", "facebook", "youtube"]).notNull(),
  title: varchar("title", { length: 255 }),
  caption: text("caption"),
  script: text("script"),
  callToAction: varchar("callToAction", { length: 255 }),
  disclosure: text("disclosure").notNull(),
  trackingUrl: text("trackingUrl"),
  status: mysqlEnum("status", ["draft", "approved", "scheduled", "published", "blocked"]).default("draft").notNull(),
  scheduledAt: timestamp("scheduledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ productPlatformIdx: index("content_product_platform_idx").on(table.productId, table.platform) }));

export const publishingJobs = mysqlTable("publishing_jobs", {
  id: int("id").autoincrement().primaryKey(),
  contentPackageId: int("contentPackageId").notNull(),
  platform: mysqlEnum("platform", ["instagram", "facebook", "youtube"]).notNull(),
  integrationStatus: mysqlEnum("integrationStatus", ["not_connected", "connected", "blocked", "manual_fallback"]).default("not_connected").notNull(),
  status: mysqlEnum("status", ["queued", "running", "published", "failed", "paused"]).default("queued").notNull(),
  retryCount: int("retryCount").default(0).notNull(),
  lastError: text("lastError"),
  scheduledAt: timestamp("scheduledAt"),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const attributionEvents = mysqlTable("attribution_events", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  contentPackageId: int("contentPackageId"),
  platform: varchar("platform", { length: 80 }).notNull(),
  eventType: mysqlEnum("eventType", ["click", "outbound", "order", "revenue"]).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }),
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
