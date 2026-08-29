import { autoScanAndParseLink, ScannedProductResult } from "./linkScanner";
import { HEALTH_BEAUTY_CATALOG, HealthBeautyItem } from "../shared/commerce";

export interface AffiliateSourceLink {
  id: string;
  url: string;
  label: string;
  storeName: string;
  category: "Skincare" | "Hair Care" | "Wellness & Supplements" | "Body Care" | "Clean Beauty" | "All Health & Beauty";
  status: "active" | "expired" | "checking";
  lastScannedAt: string;
  productsFoundCount: number;
  addedAt: string;
}

// Initial registered affiliate source feeds
let affiliateSourceRegistry: AffiliateSourceLink[] = [
  {
    id: "src-flipkart-beauty",
    url: "https://fkrt.co/pDEIvN",
    label: "Flipkart Health & Beauty Store Hub",
    storeName: "Flipkart Health & Beauty",
    category: "All Health & Beauty",
    status: "active",
    lastScannedAt: new Date().toISOString(),
    productsFoundCount: 1,
    addedAt: new Date().toISOString(),
  },
  {
    id: "src-flipkart-derma",
    url: "https://fkrt.co/ykrYNt",
    label: "Flipkart The Derma Co Acne Care",
    storeName: "Flipkart Health & Beauty",
    category: "Skincare",
    status: "active",
    lastScannedAt: new Date().toISOString(),
    productsFoundCount: 1,
    addedAt: new Date().toISOString(),
  },
  {
    id: "src-extrape-tira",
    url: "https://extrape.com/c/tira-laneige-lip-mask",
    label: "Tira Beauty Lip & Skin Deals",
    storeName: "Tira Beauty (Reliance)",
    category: "Skincare",
    status: "active",
    lastScannedAt: new Date().toISOString(),
    productsFoundCount: 1,
    addedAt: new Date().toISOString(),
  },
  {
    id: "src-extrape-dotkey",
    url: "https://extrape.com/c/dotkey-barrier-repair",
    label: "Dot & Key Barrier Care Feed",
    storeName: "Dot & Key Skincare",
    category: "Skincare",
    status: "active",
    lastScannedAt: new Date().toISOString(),
    productsFoundCount: 1,
    addedAt: new Date().toISOString(),
  },
  {
    id: "src-extrape-plum",
    url: "https://extrape.com/c/plum-vitaminc-mandarin",
    label: "Plum Clean Beauty Feed",
    storeName: "Plum Goodness",
    category: "Clean Beauty",
    status: "active",
    lastScannedAt: new Date().toISOString(),
    productsFoundCount: 1,
    addedAt: new Date().toISOString(),
  },
  {
    id: "src-iherb-wellness",
    url: "https://www.iherb.com/c/beauty",
    label: "iHerb Global Clean Skincare & Wellness",
    storeName: "iHerb Global",
    category: "Wellness & Supplements",
    status: "active",
    lastScannedAt: new Date().toISOString(),
    productsFoundCount: 2,
    addedAt: new Date().toISOString(),
  },
];

export function getAffiliateSources(): AffiliateSourceLink[] {
  return affiliateSourceRegistry;
}

export function addAffiliateSource(url: string, label?: string): { success: boolean; source: AffiliateSourceLink; scanResult: ScannedProductResult } {
  const trimmedUrl = url.trim();
  const scanResult = autoScanAndParseLink(trimmedUrl);

  const newSource: AffiliateSourceLink = {
    id: `src-${Date.now()}`,
    url: trimmedUrl,
    label: label || scanResult.detectedStore || "Affiliate Link Feed",
    storeName: scanResult.detectedStore || "Partner Merchant",
    category: "All Health & Beauty",
    status: scanResult.success ? "active" : "expired",
    lastScannedAt: new Date().toISOString(),
    productsFoundCount: scanResult.success ? 1 : 0,
    addedAt: new Date().toISOString(),
  };

  affiliateSourceRegistry.unshift(newSource);

  // If parsed product was successfully extracted, add to active catalog
  if (scanResult.success && scanResult.product) {
    const existingIndex = HEALTH_BEAUTY_CATALOG.findIndex((p) => p.slug === scanResult.product?.slug);
    if (existingIndex >= 0) {
      HEALTH_BEAUTY_CATALOG[existingIndex] = scanResult.product;
    } else {
      HEALTH_BEAUTY_CATALOG.unshift(scanResult.product);
    }
  }

  return {
    success: scanResult.success,
    source: newSource,
    scanResult,
  };
}

export function removeAffiliateSource(sourceId: string): boolean {
  const index = affiliateSourceRegistry.findIndex((s) => s.id === sourceId);
  if (index >= 0) {
    affiliateSourceRegistry.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Hourly Automated Health & Beauty Scanner
 * Validates links, removes expired ones, and updates store catalog.
 */
export async function runHourlyScan(): Promise<{
  totalScanned: number;
  activeCount: number;
  expiredCount: number;
  updatedCatalogCount: number;
  scannedAt: string;
}> {
  console.log(`[Hourly Scanner] 🕒 Starting automated hourly scan across ${affiliateSourceRegistry.length} affiliate source feeds...`);
  
  let activeCount = 0;
  let expiredCount = 0;

  for (const source of affiliateSourceRegistry) {
    source.status = "checking";
    const scan = autoScanAndParseLink(source.url);

    if (scan.success && scan.product) {
      source.status = "active";
      source.lastScannedAt = new Date().toISOString();
      source.productsFoundCount = 1;
      activeCount++;

      // Update catalog entry
      const existingIndex = HEALTH_BEAUTY_CATALOG.findIndex((p) => p.slug === scan.product?.slug);
      if (existingIndex >= 0) {
        HEALTH_BEAUTY_CATALOG[existingIndex] = scan.product;
      } else {
        HEALTH_BEAUTY_CATALOG.push(scan.product);
      }
    } else {
      // Mark as expired / dead link and flag
      source.status = "expired";
      source.lastScannedAt = new Date().toISOString();
      expiredCount++;
      console.warn(`[Hourly Scanner] ⚠️ Flagged expired affiliate link: ${source.url}`);
    }
  }

  const scannedAt = new Date().toISOString();
  console.log(`[Hourly Scanner] ✅ Completed. Active: ${activeCount}, Expired: ${expiredCount}, Total Catalog: ${HEALTH_BEAUTY_CATALOG.length}`);

  return {
    totalScanned: affiliateSourceRegistry.length,
    activeCount,
    expiredCount,
    updatedCatalogCount: HEALTH_BEAUTY_CATALOG.length,
    scannedAt,
  };
}

// Background scheduler timer (runs every 60 minutes)
let hourlyTimer: NodeJS.Timeout | null = null;

export function startHourlyScheduler() {
  if (hourlyTimer) return;
  
  const ONE_HOUR_MS = 60 * 60 * 1000;
  console.log("[Auto-Scheduler] ⏰ Initialized hourly affiliate deal scanner background daemon.");

  hourlyTimer = setInterval(() => {
    runHourlyScan().catch((err) => console.error("[Auto-Scheduler] Error in hourly scan:", err));
  }, ONE_HOUR_MS);
}

// Initialize on startup
startHourlyScheduler();
