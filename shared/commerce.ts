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
  sephora: {
    id: "sephora",
    name: "Sephora Global",
    region: "global",
    website: "https://sephora.com",
    affiliateNetwork: "Rakuten / CJ",
    shippingWorldwide: true,
    shipsToIndia: false,
    freeShippingAbove: { usd: 50, inr: 4200 },
    standardShippingFee: { usd: 5.95, inr: 500 },
    deliveryTimeDays: "3-7 days",
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
  accent: string;
  score: number;
  keyBenefit: string;
  skinType?: string;
  shipsWorldwide: boolean;
  shipsIndia: boolean;
  shippingNote: string;
  affiliateUrl: string;
  tag: string;
};

export const HEALTH_BEAUTY_CATALOG: HealthBeautyItem[] = [
  {
    id: "cosrx-snail-mucin-essence",
    slug: "cosrx-snail-mucin-essence",
    name: "Advanced Snail 96 Mucin Power Essence",
    brand: "COSRX",
    category: "Skincare",
    type: "affiliate",
    priceUsd: 19.0,
    priceInr: 1450,
    storeId: "iherb",
    storeName: "iHerb Global",
    accent: "from-amber-100 via-orange-50 to-rose-50",
    score: 96,
    keyBenefit: "Deep barrier repair & instant glass skin hydration (96.3% snail secretion filtrate).",
    skinType: "All skin types · Dehydrated · Sensitive",
    shipsWorldwide: true,
    shipsIndia: true,
    shippingNote: "Worldwide shipping · Free over $40 (₹3,300) on iHerb",
    affiliateUrl: "https://www.iherb.com/pr/cosrx-advanced-snail-96-mucin-power-essence-3-38-fl-oz-100-ml/64016?rcode=JANRAAFF",
    tag: "Global Bestseller",
  },
  {
    id: "the-ordinary-niacinamide-zinc",
    slug: "the-ordinary-niacinamide-zinc",
    name: "Niacinamide 10% + Zinc 1% Oil Control Serum",
    brand: "The Ordinary",
    category: "Skincare",
    type: "affiliate",
    priceUsd: 6.5,
    priceInr: 600,
    storeId: "nykaa",
    storeName: "Nykaa (India & Global)",
    accent: "from-sky-100 via-cyan-50 to-indigo-50",
    score: 94,
    keyBenefit: "Minimizes enlarged pores, regulates sebum, and balances skin texture.",
    skinType: "Oily · Acne-prone · Combination",
    shipsWorldwide: true,
    shipsIndia: true,
    shippingNote: "India express delivery · Free over ₹499",
    affiliateUrl: "https://www.nykaa.com/the-ordinary-niacinamide-10-zinc-1/p/5003153?aff=janra",
    tag: "High Repeat Pick",
  },
  {
    id: "mielle-rosemary-mint-oil",
    slug: "mielle-rosemary-mint-oil",
    name: "Rosemary Mint Scalp & Hair Strengthening Oil",
    brand: "Mielle Organics",
    category: "Hair Care",
    type: "affiliate",
    priceUsd: 9.99,
    priceInr: 899,
    storeId: "amazon_global",
    storeName: "Amazon Global",
    accent: "from-emerald-100 via-teal-50 to-lime-50",
    score: 93,
    keyBenefit: "Stimulates scalp follicles, nourishes split ends, and supports longer hair growth.",
    skinType: "Thinning hair · Dry scalp · All textures",
    shipsWorldwide: true,
    shipsIndia: true,
    shippingNote: "Worldwide shipping via Amazon Global & Amazon India",
    affiliateUrl: "https://www.amazon.com/dp/B07N7PK9QK?tag=janra-20",
    tag: "Viral Haircare",
  },
  {
    id: "cerave-hydrating-facial-cleanser",
    slug: "cerave-hydrating-facial-cleanser",
    name: "Hydrating Facial Cleanser with Ceramides & Hyaluronic Acid",
    brand: "CeraVe",
    category: "Skincare",
    type: "affiliate",
    priceUsd: 14.99,
    priceInr: 1250,
    storeId: "iherb",
    storeName: "iHerb Global",
    accent: "from-blue-100 via-teal-50 to-sky-50",
    score: 95,
    keyBenefit: "Non-foaming lotion cleanser that removes impurities without stripping skin barrier.",
    skinType: "Normal to Dry · Sensitive",
    shipsWorldwide: true,
    shipsIndia: true,
    shippingNote: "Worldwide shipping · Free over $40 (₹3,300)",
    affiliateUrl: "https://www.iherb.com/pr/cerave-hydrating-facial-cleanser-16-fl-oz-473-ml/83025?rcode=JANRAAFF",
    tag: "Dermatologist Approved",
  },
  {
    id: "minimalist-10-vitamin-c",
    slug: "minimalist-10-vitamin-c",
    name: "10% Vitamin C Face Glow & Brightening Serum",
    brand: "Minimalist",
    category: "Skincare",
    type: "affiliate",
    priceUsd: 11.0,
    priceInr: 699,
    storeId: "nykaa",
    storeName: "Nykaa / Minimalist Store",
    accent: "from-amber-200 via-yellow-50 to-orange-50",
    score: 92,
    keyBenefit: "Reduces dark spots, provides sun damage defense with stable ethyl ascorbic acid.",
    skinType: "Dull skin · Uneven skin tone",
    shipsWorldwide: true,
    shipsIndia: true,
    shippingNote: "Ships India (Free > ₹499) & Global via Amazon/iHerb",
    affiliateUrl: "https://www.nykaa.com/minimalist-10-vitamin-c-face-serum/p/1067982?aff=janra",
    tag: "Clean Formulation",
  },
  {
    id: "organic-india-ashwagandha",
    slug: "organic-india-ashwagandha",
    name: "Organic KSM-66 Ashwagandha Stress Relief & Energy",
    brand: "Organic India",
    category: "Wellness & Supplements",
    type: "affiliate",
    priceUsd: 17.5,
    priceInr: 450,
    storeId: "amazon_in",
    storeName: "Amazon India / iHerb Global",
    accent: "from-stone-200 via-amber-50 to-orange-50",
    score: 91,
    keyBenefit: "Ayurvedic adaptogen that lowers cortisol, boosts sleep quality and stamina.",
    skinType: "Stress relief · Daily vitality",
    shipsWorldwide: true,
    shipsIndia: true,
    shippingNote: "India & Worldwide shipping available",
    affiliateUrl: "https://www.amazon.in/dp/B003PLNA6A?tag=janra-21",
    tag: "Herbal Wellness",
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

export function buildTrackedPath(productSlug: string, source: string, campaign: string) {
  const params = new URLSearchParams({ src: source, campaign });
  return `/go/${encodeURIComponent(productSlug)}?${params.toString()}`;
}
