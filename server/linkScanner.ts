import { AFFILIATE_CONFIG, HealthBeautyItem, STORE_PARTNERS } from "../shared/commerce.js";
import { createContentDraft } from "../shared/content.js";

export interface ScannedProductResult {
  success: boolean;
  product?: HealthBeautyItem;
  socialDrafts?: {
    facebook: ReturnType<typeof createContentDraft>;
    instagram: ReturnType<typeof createContentDraft>;
    youtube: ReturnType<typeof createContentDraft>;
  };
  detectedStore: string;
  error?: string;
}

export function detectStoreFromUrl(url: string): { storeId: string; storeName: string } {
  const lower = url.toLowerCase();
  if (lower.includes("fkrt.co") || lower.includes("flipkart.com")) {
    return { storeId: "flipkart", storeName: "Flipkart Health & Beauty" };
  }
  if (lower.includes("extrape.com") || lower.includes("extp.in")) {
    return { storeId: "extrape", storeName: "ExtraPe Verified Deals" };
  }
  if (lower.includes("nykaa.com")) {
    return { storeId: "nykaa", storeName: "Nykaa" };
  }
  if (lower.includes("amazon.in")) {
    return { storeId: "amazon_in", storeName: "Amazon India" };
  }
  if (lower.includes("amazon.com")) {
    return { storeId: "amazon_global", storeName: "Amazon Global" };
  }
  if (lower.includes("iherb.com")) {
    return { storeId: "iherb", storeName: "iHerb Global" };
  }
  if (lower.includes("tirabeauty.com") || lower.includes("tira")) {
    return { storeId: "tira", storeName: "Tira Beauty (Reliance)" };
  }
  if (lower.includes("myntra.com")) {
    return { storeId: "myntra", storeName: "Myntra Beauty" };
  }
  if (lower.includes("ajio.com") || lower.includes("ajio")) {
    return { storeId: "ajio", storeName: "Ajio Beauty & Luxury" };
  }
  if (lower.includes("1mg.com") || lower.includes("tata1mg")) {
    return { storeId: "tata1mg", storeName: "Tata 1mg Wellness" };
  }
  if (lower.includes("dotandkey.com")) {
    return { storeId: "dotandkey", storeName: "Dot & Key Skincare" };
  }
  if (lower.includes("plumgoodness.com")) {
    return { storeId: "plum", storeName: "Plum Goodness" };
  }
  if (lower.includes("foxtale.in")) {
    return { storeId: "foxtale", storeName: "Foxtale Daily Skincare" };
  }
  if (lower.includes("purplle.com")) {
    return { storeId: "purplle", storeName: "Purplle Beauty" };
  }
  return { storeId: "extrape", storeName: "Brand Janra Partner Store" };
}

export function autoScanAndParseLink(url: string, manualOverrides?: Partial<HealthBeautyItem>): ScannedProductResult {
  try {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      return { success: false, detectedStore: "unknown", error: "Empty URL provided" };
    }

    const { storeId, storeName } = detectStoreFromUrl(trimmedUrl);
    const storeInfo = STORE_PARTNERS[storeId] || STORE_PARTNERS.extrape;

    // Generate unique product slug and id
    const timestamp = Date.now();
    const cleanUrlSlug = trimmedUrl.split("/").filter(Boolean).pop()?.replace(/[^a-zA-Z0-9-]/g, "") || `item-${timestamp}`;
    const slug = manualOverrides?.slug || `bj-${storeId}-${cleanUrlSlug.slice(0, 30)}`;

    const category = manualOverrides?.category || "Skincare";
    const brand = manualOverrides?.brand || (storeId === "dotandkey" ? "Dot & Key" : storeId === "plum" ? "Plum Goodness" : storeId === "foxtale" ? "Foxtale" : "Curated Beauty");
    const name = manualOverrides?.name || `${brand} Curated Health & Beauty Pick`;
    const priceInr = manualOverrides?.priceInr || 499;
    const priceUsd = manualOverrides?.priceUsd || Number((priceInr / 83).toFixed(2));
    const keyBenefit = manualOverrides?.keyBenefit || "Dermatologist-tested formulation for healthy skin hydration and barrier protection.";

    const product: HealthBeautyItem = {
      id: `scanned-${slug}`,
      slug,
      name,
      brand,
      category,
      type: "affiliate",
      priceUsd,
      priceInr,
      storeId,
      storeName,
      imageUrl: manualOverrides?.imageUrl || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&auto=format&fit=crop&q=80",
      accent: "from-rose-100 via-amber-50 to-pink-50",
      score: 95,
      keyBenefit,
      skinType: manualOverrides?.skinType || "All skin types",
      shipsWorldwide: storeInfo.shippingWorldwide,
      shipsIndia: storeInfo.shipsToIndia,
      shippingNote: storeInfo.shipsToIndia 
        ? `${storeInfo.deliveryTimeDays} · Free over ₹${storeInfo.freeShippingAbove.inr}` 
        : `Worldwide delivery · Free over $${storeInfo.freeShippingAbove.usd}`,
      affiliateUrl: trimmedUrl,
      tag: "Scanned & Verified Deal",
      approvedForPublishing: true,
      ...manualOverrides,
    };

    // Auto-generate Multi-Channel Social Copy
    const fbDraft = createContentDraft({
      productName: product.name,
      brand: product.brand,
      category: product.category,
      reasonToConsider: product.keyBenefit,
      productSlug: product.slug,
      source: "facebook",
      campaign: "scanned_deals",
      affiliate: true,
      shippingNote: product.shippingNote,
    });

    const igDraft = createContentDraft({
      productName: product.name,
      brand: product.brand,
      category: product.category,
      reasonToConsider: product.keyBenefit,
      productSlug: product.slug,
      source: "instagram",
      campaign: "scanned_deals",
      affiliate: true,
      shippingNote: product.shippingNote,
    });

    const ytDraft = createContentDraft({
      productName: product.name,
      brand: product.brand,
      category: product.category,
      reasonToConsider: product.keyBenefit,
      productSlug: product.slug,
      source: "youtube",
      campaign: "scanned_deals",
      affiliate: true,
      shippingNote: product.shippingNote,
    });

    return {
      success: true,
      product,
      detectedStore: storeName,
      socialDrafts: {
        facebook: fbDraft,
        instagram: igDraft,
        youtube: ytDraft,
      },
    };
  } catch (error) {
    return {
      success: false,
      detectedStore: "unknown",
      error: error instanceof Error ? error.message : "Failed to scan link",
    };
  }
}
