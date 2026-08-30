DO $$ BEGIN CREATE TYPE "role" AS ENUM ('user', 'admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "productType" AS ENUM ('affiliate', 'direct'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "sourceType" AS ENUM ('affiliate', 'supplier'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "status" AS ENUM ('draft', 'active', 'paused'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "availabilityStatus" AS ENUM ('unknown', 'in_stock', 'out_of_stock'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "claimSafetyStatus" AS ENUM ('needs_review', 'approved', 'blocked'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "linkStatus" AS ENUM ('active', 'expired', 'paused', 'needs_review'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "platform" AS ENUM ('meta', 'youtube'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "socialStatus" AS ENUM ('connected', 'expired', 'revoked', 'needs_review'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "contentPlatform" AS ENUM ('instagram', 'facebook', 'youtube'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "contentStatus" AS ENUM ('draft', 'approved', 'scheduled', 'published', 'blocked'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "integrationStatus" AS ENUM ('not_connected', 'connected', 'blocked', 'manual_fallback'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "publishingStatus" AS ENUM ('queued', 'running', 'published', 'failed', 'paused'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "eventType" AS ENUM ('click', 'outbound', 'order', 'revenue'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "orderStatus" AS ENUM ('pending', 'paid', 'fulfilled', 'cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "socialPlatform" AS ENUM ('meta', 'youtube'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
CREATE TABLE "attribution_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"productId" integer NOT NULL,
	"contentPackageId" integer,
	"platform" varchar(80) NOT NULL,
	"eventType" "eventType" NOT NULL,
	"amount" numeric(12, 2),
	"externalReference" varchar(180),
	"consentGiven" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"productId" integer NOT NULL,
	"platform" "contentPlatform" NOT NULL,
	"title" varchar(255),
	"caption" text,
	"script" text,
	"callToAction" varchar(255),
	"disclosure" text NOT NULL,
	"trackingUrl" text,
	"status" "contentStatus" DEFAULT 'draft' NOT NULL,
	"scheduledAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offer_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(160) NOT NULL,
	"sourceType" "sourceType" NOT NULL,
	"endpointUrl" text NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"lastCheckedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"productId" integer NOT NULL,
	"orderReference" varchar(80) NOT NULL,
	"customerName" varchar(160) NOT NULL,
	"customerEmail" varchar(320) NOT NULL,
	"status" "orderStatus" DEFAULT 'pending' NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(8) DEFAULT 'USD' NOT NULL,
	"consentGiven" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_orderReference_unique" UNIQUE("orderReference")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(120) NOT NULL,
	"productType" "productType" NOT NULL,
	"price" numeric(12, 2),
	"currency" varchar(8) DEFAULT 'USD' NOT NULL,
	"imageUrl" text,
	"destinationUrl" text,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"availabilityStatus" "availabilityStatus" DEFAULT 'unknown' NOT NULL,
	"claimSafetyStatus" "claimSafetyStatus" DEFAULT 'needs_review' NOT NULL,
	"audienceFitScore" integer DEFAULT 0 NOT NULL,
	"profitabilityScore" integer DEFAULT 0 NOT NULL,
	"availabilityScore" integer DEFAULT 0 NOT NULL,
	"safetyScore" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "publishing_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"contentPackageId" integer NOT NULL,
	"platform" "contentPlatform" NOT NULL,
	"integrationStatus" "integrationStatus" DEFAULT 'not_connected' NOT NULL,
	"status" "publishingStatus" DEFAULT 'queued' NOT NULL,
	"retryCount" integer DEFAULT 0 NOT NULL,
	"lastError" text,
	"scheduledAt" timestamp,
	"publishedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" "socialPlatform" NOT NULL,
	"accountId" varchar(180) NOT NULL,
	"accountName" varchar(255),
	"accessToken" text NOT NULL,
	"refreshToken" text,
	"tokenExpiresAt" timestamp,
	"scopes" text,
	"status" "socialStatus" DEFAULT 'connected' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracked_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"productId" integer NOT NULL,
	"token" varchar(80) NOT NULL,
	"source" varchar(80) NOT NULL,
	"network" varchar(80) DEFAULT 'cj' NOT NULL,
	"externalLinkId" varchar(180),
	"campaign" varchar(120) NOT NULL,
	"destinationUrl" text NOT NULL,
	"imageUrl" text,
	"linkStatus" "linkStatus" DEFAULT 'active' NOT NULL,
	"firstSeenAt" timestamp DEFAULT now() NOT NULL,
	"lastSeenAt" timestamp DEFAULT now() NOT NULL,
	"expiresAt" timestamp,
	"lastCheckedAt" timestamp,
	"lastCheckError" text,
	"clickCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tracked_links_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE INDEX "attribution_events_event_idx" ON "attribution_events" USING btree ("eventType","platform");--> statement-breakpoint
CREATE INDEX "content_product_platform_idx" ON "content_packages" USING btree ("productId","platform");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "products_type_idx" ON "products" USING btree ("productType");--> statement-breakpoint
CREATE INDEX "social_connections_platform_idx" ON "social_connections" USING btree ("platform","status");--> statement-breakpoint
CREATE INDEX "tracked_links_product_idx" ON "tracked_links" USING btree ("productId");--> statement-breakpoint
CREATE INDEX "tracked_links_lifecycle_idx" ON "tracked_links" USING btree ("network","linkStatus","lastCheckedAt");