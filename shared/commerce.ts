export type OfferSignals = {
  profitability: number;
  availability: number;
  audienceFit: number;
  claimSafety: number;
};

export type StorePartner = {
  id: string;
  name: string;
  region: "global" | "india" | "both";
  website: string;
  affiliateNetwork: string;
  shippingWorldwide: boolean;
  shipsToIndia: boolean;
  freeShippingAbove: {
    usd: number;
    inr: number;
  };
  standardShippingFee: {
    usd: number;
    inr: number;
  };
  deliveryTimeDays: string;
};

export const STORE_PARTNERS: Record<string, StorePartner> = {
  flipkart: {
    id: "flipkart",
    name: "Flipkart Health & Beauty",
    region: "india",
    website: "https://flipkart.com",
    affiliateNetwork: "Flipkart Affiliate / ExtraPe",
    shippingWorldwide: false,
    shipsToIndia: true,
    freeShippingAbove: { usd: 6, inr: 500 },
    standardShippingFee: { usd: 0.5, inr: 40 },
    deliveryTimeDays: "2-4 days (India)",
  },
  ajio: {
    id: "ajio",
    name: "Ajio Beauty & Luxury (Reliance)",
    region: "india",
    website: "https://ajio.com",
    affiliateNetwork: "Ajio / ExtraPe",
    shippingWorldwide: false,
    shipsToIndia: true,
    freeShippingAbove: { usd: 9.5, inr: 799 },
    standardShippingFee: { usd: 0.8, inr: 69 },
    deliveryTimeDays: "2-4 days (India)",
  },
  nykaa: {
    id: "nykaa",
    name: "Nykaa (India)",
    region: "india",
    website: "https://nykaa.com",
    affiliateNetwork: "Nykaa Affiliate / Cuelinks",
    shippingWorldwide: false,
    shipsToIndia: true,
    freeShippingAbove: { usd: 6, inr: 499 },
    standardShippingFee: { usd: 0.9, inr: 70 },
    deliveryTimeDays: "2-4 days (India)",
  },
  tira: {
    id: "tira",
    name: "Tira Beauty (Reliance)",
    region: "india",
    website: "https://tirabeauty.com",
    affiliateNetwork: "Tira / ExtraPe",
    shippingWorldwide: false,
    shipsToIndia: true,
    freeShippingAbove: { usd: 6, inr: 499 },
    standardShippingFee: { usd: 0.7, inr: 50 },
    deliveryTimeDays: "2-4 days (India)",
  },
  iherb: {
    id: "iherb",
    name: "iHerb Global",
    region: "global",
    website: "https://iherb.com",
    affiliateNetwork: "iHerb Rewards / Impact",
    shippingWorldwide: true,
    shipsToIndia: true,
    freeShippingAbove: { usd: 40, inr: 3300 },
    standardShippingFee: { usd: 4.99, inr: 400 },
    deliveryTimeDays: "4-8 days",
  },
  amazon_global: {
    id: "amazon_global",
    name: "Amazon Global",
    region: "global",
    website: "https://amazon.com",
    affiliateNetwork: "Amazon Associates US",
    shippingWorldwide: true,
    shipsToIndia: true,
    freeShippingAbove: { usd: 35, inr: 2900 },
    standardShippingFee: { usd: 6.99, inr: 580 },
    deliveryTimeDays: "5-10 days",
  },
  amazon_in: {
    id: "amazon_in",
    name: "Amazon India",
    region: "india",
    website: "https://amazon.in",
    affiliateNetwork: "Amazon Associates India",
    shippingWorldwide: false,
    shipsToIndia: true,
    freeShippingAbove: { usd: 6, inr: 499 },
    standardShippingFee: { usd: 0.5, inr: 40 },
    deliveryTimeDays: "1-3 days (India)",
  },
  dotandkey: {
    id: "dotandkey",
    name: "Dot & Key Skincare",
    region: "india",
    website: "https://dotandkey.com",
    affiliateNetwork: "Dot & Key / ExtraPe",
    shippingWorldwide: false,
    shipsToIndia: true,
    freeShippingAbove: { usd: 5, inr: 399 },
    standardShippingFee: { usd: 0.5, inr: 40 },
    deliveryTimeDays: "2-3 days (India)",
  },
  plum: {
    id: "plum",
    name: "Plum Goodness (Clean Vegan)",
    region: "india",
    website: "https://plumgoodness.com",
    affiliateNetwork: "Plum / ExtraPe",
    shippingWorldwide: false,
    shipsToIndia: true,
    freeShippingAbove: { usd: 5, inr: 399 },
    standardShippingFee: { usd: 0.5, inr: 40 },
    deliveryTimeDays: "2-4 days (India)",
  },
  foxtale: {
    id: "foxtale",
    name: "Foxtale Daily Skincare",
    region: "india",
    website: "https://foxtale.in",
    affiliateNetwork: "Foxtale / ExtraPe",
    shippingWorldwide: false,
    shipsToIndia: true,
    freeShippingAbove: { usd: 6, inr: 499 },
    standardShippingFee: { usd: 0.5, inr: 40 },
    deliveryTimeDays: "2-4 days (India)",
  },
  purplle: {
    id: "purplle",
    name: "Purplle Beauty & Care",
    region: "india",
    website: "https://purplle.com",
    affiliateNetwork: "Purplle / ExtraPe",
    shippingWorldwide: false,
    shipsToIndia: true,
    freeShippingAbove: { usd: 5, inr: 399 },
    standardShippingFee: { usd: 0.6, inr: 49 },
    deliveryTimeDays: "2-5 days (India)",
  },
  tata1mg: {
    id: "tata1mg",
    name: "Tata 1mg Wellness",
    region: "india",
    website: "https://1mg.com",
    affiliateNetwork: "Tata 1mg / ExtraPe",
    shippingWorldwide: false,
    shipsToIndia: true,
    freeShippingAbove: { usd: 6, inr: 500 },
    standardShippingFee: { usd: 0.5, inr: 40 },
    deliveryTimeDays: "1-3 days (India)",
  },
  extrape: {
    id: "extrape",
    name: "ExtraPe Deals Hub",
    region: "india",
    website: "https://extrape.com",
    affiliateNetwork: "ExtraPe Affiliate Platform",
    shippingWorldwide: false,
    shipsToIndia: true,
    freeShippingAbove: { usd: 5, inr: 399 },
    standardShippingFee: { usd: 0.5, inr: 40 },
    deliveryTimeDays: "2-4 days (India)",
  },
};

export type HealthBeautyItem = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: "Skincare" | "Hair Care" | "Wellness & Supplements" | "Body Care" | "Clean Beauty";
  type: "affiliate" | "direct";
  priceUsd: number;
  priceInr: number;
  storeId: string;
  storeName: string;
  imageUrl: string;
  accent: string;
  score: number;
  keyBenefit: string;
  skinType?: string;
  shipsWorldwide: boolean;
  shipsIndia: boolean;
  shippingNote: string;
  affiliateUrl: string;
  tag: string;
  approvedForPublishing: boolean;
  createdAt?: string;
};

// Configurable Affiliate IDs (defaults to Brand Janra tracking codes)
export const AFFILIATE_CONFIG = {
  iherbCode: process.env.AFFILIATE_IHERB_CODE || "JANRAAFF",
  amazonUsTag: process.env.AFFILIATE_AMAZON_US_TAG || "janra-20",
  amazonInTag: process.env.AFFILIATE_AMAZON_IN_TAG || "janra-21",
  nykaaId: process.env.AFFILIATE_NYKAA_ID || "janra",
  extrapeId: process.env.AFFILIATE_EXTRAPE_ID || "brandjanra",
};

export function isNewlyAdded(createdAt?: string): boolean {
  if (!createdAt) return false;
  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  return now - createdTime <= ONE_DAY_MS;
}

// Verified Catalog: Strictly items scanned/added from user affiliate links
export const HEALTH_BEAUTY_CATALOG: HealthBeautyItem[] = [
  {
    id: "neutrogena-hydro-boost-water-gel",
    slug: "neutrogena-hydro-boost-water-gel",
    name: "Hydro Boost Water Gel with Hyaluronic Acid & Amino Acids (50g)",
    brand: "Neutrogena",
    category: "Skincare",
    type: "affiliate",
    priceUsd: 5.5,
    priceInr: 440,
    storeId: "flipkart",
    storeName: "Flipkart Health & Beauty",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    accent: "from-sky-100 via-blue-50 to-cyan-50",
    score: 98,
    keyBenefit: "72-hour continuous hydration boost, oil-free water gel formula with purified hyaluronic acid.",
    skinType: "Dehydrated skin · Normal to Oily skin",
    shipsWorldwide: false,
    shipsIndia: true,
    shippingNote: "Fast 2-3 Day India Express Delivery (Free over ₹500)",
    affiliateUrl: "https://fkrt.co/pDEIvN",
    tag: "Flipkart Verified Link",
    approvedForPublishing: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "derma-co-salicylic-acid-serum",
    slug: "derma-co-salicylic-acid-serum",
    name: "2% Salicylic Acid Face Serum for Active Acne & Blackheads",
    brand: "The Derma Co",
    category: "Skincare",
    type: "affiliate",
    priceUsd: 6.0,
    priceInr: 499,
    storeId: "flipkart",
    storeName: "Flipkart Health & Beauty",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
    accent: "from-teal-100 via-emerald-50 to-cyan-50",
    score: 94,
    keyBenefit: "Deeply clears clogged pores, reduces active acne blemishes and controls excess oil.",
    skinType: "Acne-prone · Oily · Congested skin",
    shipsWorldwide: false,
    shipsIndia: true,
    shippingNote: "Fast 2-3 Day India Delivery via Flipkart (Free over ₹500)",
    affiliateUrl: "https://fkrt.co/ykrYNt",
    tag: "Flipkart Verified Link",
    approvedForPublishing: true,
    createdAt: new Date().toISOString(),
  },
];

export function calculateShippingCharge(storeId: string, destination: "india" | "worldwide", cartTotalUsd: number) {
  const store = STORE_PARTNERS[storeId] || STORE_PARTNERS.iherb;
  const isIndia = destination === "india";

  if (isIndia) {
    if (!store.shipsToIndia) {
      return {
        available: false,
        shippingFeeUsd: 0,
        shippingFeeInr: 0,
        freeThresholdMet: false,
        deliveryDays: "Not shipping to India",
        message: `${store.name} does not ship directly to India. Choose a global merchant or Indian partner.`,
      };
    }
    const meetsThreshold = cartTotalUsd >= store.freeShippingAbove.usd;
    return {
      available: true,
      shippingFeeUsd: meetsThreshold ? 0 : store.standardShippingFee.usd,
      shippingFeeInr: meetsThreshold ? 0 : store.standardShippingFee.inr,
      freeThresholdMet: meetsThreshold,
      deliveryDays: store.deliveryTimeDays,
      message: meetsThreshold
        ? `Free Shipping to India (Order meets ₹${store.freeShippingAbove.inr} / $${store.freeShippingAbove.usd} threshold)`
        : `Standard Shipping: ₹${store.standardShippingFee.inr} ($${store.standardShippingFee.usd}). Free on orders over ₹${store.freeShippingAbove.inr}.`,
    };
  }

  // Worldwide destination
  if (!store.shippingWorldwide) {
    return {
      available: false,
      shippingFeeUsd: 0,
      shippingFeeInr: 0,
      freeThresholdMet: false,
      deliveryDays: "Domestic India only",
      message: `${store.name} is a local Indian store and does not ship globally.`,
    };
  }

  const meetsThreshold = cartTotalUsd >= store.freeShippingAbove.usd;
  return {
    available: true,
    shippingFeeUsd: meetsThreshold ? 0 : store.standardShippingFee.usd,
    shippingFeeInr: meetsThreshold ? 0 : store.standardShippingFee.inr,
    freeThresholdMet: meetsThreshold,
    deliveryDays: store.deliveryTimeDays,
    message: meetsThreshold
      ? `Free Worldwide Shipping (Order meets $${store.freeShippingAbove.usd} threshold)`
      : `Worldwide Shipping: $${store.standardShippingFee.usd}. Free on orders over $${store.freeShippingAbove.usd}.`,
  };
}

export function scoreOffer(signals: OfferSignals) {
  const values = Object.values(signals);
  const clamped = values.map((value) => Math.max(0, Math.min(100, value)));
  return Math.round(clamped.reduce((total, value) => total + value, 0) / clamped.length);
}

export function hasRequiredDisclosure(content: string, isAffiliate: boolean) {
  if (!isAffiliate) return true;
  const normalized = content.toLowerCase();
  return normalized.includes("affiliate") || normalized.includes("commission") || normalized.includes("partner link") || normalized.includes("#ad");
}

export function canPublishOffer(input: { destinationReachable: boolean; inStock: boolean; claimSafetyApproved: boolean; content: string; isAffiliate: boolean }) {
  return input.destinationReachable && input.inStock && input.claimSafetyApproved && hasRequiredDisclosure(input.content, input.isAffiliate);
}

export interface RecommendedDeal {
  id: string;
  name: string;
  brand: string;
  category: "Skincare" | "Hair Care" | "Wellness & Supplements" | "Body Care" | "Clean Beauty";
  originalPriceInr: number;
  dealPriceInr: number;
  originalPriceUsd: number;
  dealPriceUsd: number;
  discountPercent: number;
  storeId: string;
  storeName: string;
  affiliateNetwork: string;
  affiliateUrl: string;
  imageUrl: string;
  keyBenefit: string;
  skinType: string;
  rating: number;
  reviewsCount: number;
  shipsIndia: boolean;
  shipsWorldwide: boolean;
  shippingNote: string;
  trendingRank: number;
  approved: boolean;
  createdAt?: string;
}

export const RECOMMENDED_DEALS_POOL: RecommendedDeal[] = [
  {
    id: "deal-tira-laneige-lip-sleeping-mask",
    name: "Laneige Lip Sleeping Mask Berry EX (20g)",
    brand: "Laneige",
    category: "Skincare",
    originalPriceInr: 1420,
    dealPriceInr: 1199,
    originalPriceUsd: 18.0,
    dealPriceUsd: 14.5,
    discountPercent: 16,
    storeId: "tira",
    storeName: "Tira Beauty (Reliance)",
    affiliateNetwork: "Tira / ExtraPe",
    affiliateUrl: `https://extrape.com/c/tira-laneige-lip-mask?aff=${AFFILIATE_CONFIG.extrapeId}`,
    imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
    keyBenefit: "Moisture Wrap™ technology with Berry Fruit Complex melts dead skin cells overnight for plump lips.",
    skinType: "Chapped lips · All skin types",
    rating: 4.8,
    reviewsCount: 14200,
    shipsIndia: true,
    shipsWorldwide: false,
    shippingNote: "Express 2-Day Delivery (Free on Tira over ₹499)",
    trendingRank: 1,
    approved: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "deal-foxtale-comfort-ceramide-sunscreen",
    name: "Dewy Sunscreen SPF 50 PA++++ with Niacinamide & Vitamin C",
    brand: "Foxtale",
    category: "Clean Beauty",
    originalPriceInr: 595,
    dealPriceInr: 449,
    originalPriceUsd: 7.5,
    dealPriceUsd: 5.5,
    discountPercent: 25,
    storeId: "foxtale",
    storeName: "Foxtale Daily Skincare",
    affiliateNetwork: "Foxtale / ExtraPe",
    affiliateUrl: `https://extrape.com/c/foxtale-dewy-sunscreen?aff=${AFFILIATE_CONFIG.extrapeId}`,
    imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80",
    keyBenefit: "Zero white cast, ultra-lightweight glow finish that prevents UV tanning and strengthens skin barrier.",
    skinType: "Normal to Dry skin · Sensitive skin safe",
    rating: 4.7,
    reviewsCount: 8900,
    shipsIndia: true,
    shipsWorldwide: false,
    shippingNote: "Fast India shipping (Free over ₹499)",
    trendingRank: 2,
    approved: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "deal-tata1mg-marine-collagen-peptides",
    name: "Hydrolyzed Pure Marine Collagen Peptides with Hyaluronic Acid & Biotin",
    brand: "Tata 1mg / Wellbeing Nutrition",
    category: "Wellness & Supplements",
    originalPriceInr: 2299,
    dealPriceInr: 1699,
    originalPriceUsd: 28.0,
    dealPriceUsd: 20.5,
    discountPercent: 26,
    storeId: "tata1mg",
    storeName: "Tata 1mg Wellness",
    affiliateNetwork: "Tata 1mg / ExtraPe",
    affiliateUrl: `https://extrape.com/c/tata1mg-marine-collagen?aff=${AFFILIATE_CONFIG.extrapeId}`,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
    keyBenefit: "Supports skin elasticity, hair follicle density, and joint cartilage regeneration.",
    skinType: "Skin aging · Brittle nails · Hair fall defense",
    rating: 4.9,
    reviewsCount: 6500,
    shipsIndia: true,
    shipsWorldwide: false,
    shippingNote: "Verified pharmacy delivery (Free over ₹500)",
    trendingRank: 3,
    approved: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "deal-purplle-bioderma-sensibio-h2o",
    name: "Bioderma Sensibio H2O Micellar Water Cleanser (500ml)",
    brand: "Bioderma",
    category: "Skincare",
    originalPriceInr: 1395,
    dealPriceInr: 1115,
    originalPriceUsd: 17.5,
    dealPriceUsd: 13.9,
    discountPercent: 20,
    storeId: "purplle",
    storeName: "Purplle Beauty",
    affiliateNetwork: "Purplle / ExtraPe",
    affiliateUrl: `https://extrape.com/c/purplle-bioderma-sensibio?aff=${AFFILIATE_CONFIG.extrapeId}`,
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    keyBenefit: "Physiological pH 5.5 micellar formula soothes reactive skin while removing waterproof makeup.",
    skinType: "Ultra-Sensitive · Redness-prone · Dermatologist Gold Standard",
    rating: 4.9,
    reviewsCount: 22300,
    shipsIndia: true,
    shipsWorldwide: false,
    shippingNote: "India 2-3 Day Dispatch (Free over ₹399)",
    trendingRank: 4,
    approved: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "deal-iherb-california-gold-omega3",
    name: "Premium Fish Oil Omega-3 (100 Fish Gelatin Softgels)",
    brand: "California Gold Nutrition",
    category: "Wellness & Supplements",
    originalPriceInr: 1100,
    dealPriceInr: 820,
    originalPriceUsd: 12.0,
    dealPriceUsd: 9.6,
    discountPercent: 20,
    storeId: "iherb",
    storeName: "iHerb Global",
    affiliateNetwork: "iHerb Rewards / Impact",
    affiliateUrl: `https://www.iherb.com/pr/california-gold-nutrition-omega-3-premium-fish-oil-100-fish-gelatin-softgels/62118?rcode=${AFFILIATE_CONFIG.iherbCode}`,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
    keyBenefit: "Molecularly distilled, high EPA & DHA to promote glowing skin, cardiovascular health, and reduce inflammation.",
    skinType: "Daily wellness · Skin hydration from within",
    rating: 4.9,
    reviewsCount: 154000,
    shipsIndia: true,
    shipsWorldwide: true,
    shippingNote: "Worldwide shipping · Free over $40 (₹3,300)",
    trendingRank: 5,
    approved: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "deal-myntra-sol-de-janeiro-cheirosa-68",
    name: "Brazilian Crush Cheirosa 68 Perfume Mist (90ml)",
    brand: "Sol de Janeiro",
    category: "Body Care",
    originalPriceInr: 2200,
    dealPriceInr: 1980,
    originalPriceUsd: 25.0,
    dealPriceUsd: 22.0,
    discountPercent: 10,
    storeId: "myntra",
    storeName: "Myntra Beauty",
    affiliateNetwork: "Myntra / ExtraPe",
    affiliateUrl: `https://extrape.com/c/myntra-soldejaneiro-68?aff=${AFFILIATE_CONFIG.extrapeId}`,
    imageUrl: "https://images.unsplash.com/photo-1608248597359-5972a912a76f?w=800&auto=format&fit=crop&q=80",
    keyBenefit: "Vibrant tropical floral gourmand fragrance with Brazilian jasmine and pink dragonfruit.",
    skinType: "All skin types · Long-lasting body & hair mist",
    rating: 4.8,
    reviewsCount: 9200,
    shipsIndia: true,
    shipsWorldwide: false,
    shippingNote: "2-3 Day Express (Free over ₹1,199)",
    trendingRank: 6,
    approved: true,
    createdAt: new Date().toISOString(),
  },
];

export function getRecommendedDeals(filterCategory?: string, minDiscount?: number) {
  return RECOMMENDED_DEALS_POOL.filter((deal) => {
    if (filterCategory && filterCategory !== "all" && deal.category !== filterCategory) return false;
    if (minDiscount && deal.discountPercent < minDiscount) return false;
    return true;
  });
}

export function buildTrackedPath(productSlug: string, source: string, campaign: string) {
  const params = new URLSearchParams({ src: source, campaign });
  return `/go/${encodeURIComponent(productSlug)}?${params.toString()}`;
}
