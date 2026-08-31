import { autoScanAndParseLink, ScannedProductResult } from "./linkScanner.js";

export interface AffiliateSourceLink { id: string; url: string; label: string; storeName: string; category: string; status: "active" | "expired" | "checking"; lastScannedAt: string; productsFoundCount: number; addedAt: string; }

// Intentionally empty: legacy affiliate links were removed for the new product-first launch.
const affiliateSourceRegistry: AffiliateSourceLink[] = [];

export function getAffiliateSources() { return affiliateSourceRegistry; }
export function addAffiliateSource(url: string, label?: string) {
  const scanResult = autoScanAndParseLink(url);
  const now = new Date().toISOString();
  const source: AffiliateSourceLink = { id: `src-${Date.now()}`, url: url.trim(), label: label || scanResult.detectedStore || "Affiliate Link", storeName: scanResult.detectedStore || "Partner Merchant", category: "All Health & Beauty", status: scanResult.success ? "active" : "expired", lastScannedAt: now, productsFoundCount: scanResult.success ? 1 : 0, addedAt: now };
  affiliateSourceRegistry.unshift(source);
  return { success: scanResult.success, source, scanResult };
}
export function removeAffiliateSource(sourceId: string) { const index = affiliateSourceRegistry.findIndex((source) => source.id === sourceId); if (index < 0) return false; affiliateSourceRegistry.splice(index, 1); return true; }
export async function runHourlyScan() { return { totalScanned: 0, activeCount: 0, expiredCount: 0, updatedCatalogCount: 0, scannedAt: new Date().toISOString() }; }
export function startHourlyScheduler() { /* no legacy links or background scan on launch */ }
