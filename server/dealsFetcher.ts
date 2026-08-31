import { AFFILIATE_CONFIG, HealthBeautyItem, STORE_PARTNERS } from "../shared/commerce.js";

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
  keyBenefit: string;
  skinType: string;
  rating: number;
  reviewsCount: number;
  shipsIndia: boolean;
  shipsWorldwide: boolean;
  shippingNote: string;
  trendingRank: number;
  imageUrl?: string;
  approved: boolean;
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
    keyBenefit: "Moisture Wrap™ technology with Berry Fruit Complex melts dead skin cells overnight for plump, hydrated lips.",
    skinType: "Chapped lips · All skin types",
    rating: 4.8,
    reviewsCount: 14200,
    shipsIndia: true,
    shipsWorldwide: false,
    shippingNote: "Express 2-Day Delivery (Free on Tira over ₹499)",
    trendingRank: 1,
    approved: true,
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
    keyBenefit: "Zero white cast, ultra-lightweight glow finish that prevents UV tanning and strengthens skin barrier.",
    skinType: "Normal to Dry skin · Sensitive skin safe",
    rating: 4.7,
    reviewsCount: 8900,
    shipsIndia: true,
    shipsWorldwide: false,
    shippingNote: "Fast India shipping (Free over ₹499)",
    trendingRank: 2,
    approved: true,
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
    keyBenefit: "Supports skin elasticity, hair follicle density, and joint cartilage regeneration.",
    skinType: "Skin aging · Brittle nails · Hair fall defense",
    rating: 4.9,
    reviewsCount: 6500,
    shipsIndia: true,
    shipsWorldwide: false,
    shippingNote: "Verified pharmacy delivery (Free over ₹500)",
    trendingRank: 3,
    approved: true,
  },
  {
    id: "deal-purplle-bioderma-sensibio-h2o",
    name: "Bioderma Sensibio H2O Micellar Water Cleanser & Makeup Remover (500ml)",
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
    keyBenefit: "Physiological pH 5.5 micellar formula soothes reactive skin while removing waterproof makeup.",
    skinType: "Ultra-Sensitive · Redness-prone · Dermatologist Gold Standard",
    rating: 4.9,
    reviewsCount: 22300,
    shipsIndia: true,
    shipsWorldwide: false,
    shippingNote: "India 2-3 Day Dispatch (Free over ₹399)",
    trendingRank: 4,
    approved: true,
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
    keyBenefit: "Molecularly distilled, high EPA & DHA to promote glowing skin, cardiovascular health, and reduce inflammation.",
    skinType: "Daily wellness · Skin hydration from within",
    rating: 4.9,
    reviewsCount: 154000,
    shipsIndia: true,
    shipsWorldwide: true,
    shippingNote: "Worldwide shipping · Free over $40 (₹3,300)",
    trendingRank: 5,
    approved: true,
  },
  {
    id: "deal-myntra-sol-de-janeiro-cheirosa-68",
    name: "Brazilian Crush Cheirosa 68 Beija Flor Perfume Mist (90ml)",
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
    keyBenefit: "Vibrant tropical floral gourmand fragrance with Brazilian jasmine and pink dragonfruit.",
    skinType: "All skin types · Long-lasting body & hair mist",
    rating: 4.8,
    reviewsCount: 9200,
    shipsIndia: true,
    shipsWorldwide: false,
    shippingNote: "2-3 Day Express (Free over ₹1,199)",
    trendingRank: 6,
    approved: true,
  },
];

export function getRecommendedDeals(filterCategory?: string, minDiscount?: number) {
  return RECOMMENDED_DEALS_POOL.filter((deal) => {
    if (filterCategory && filterCategory !== "all" && deal.category !== filterCategory) return false;
    if (minDiscount && deal.discountPercent < minDiscount) return false;
    return true;
  });
}

export function importDealToCatalog(dealId: string): HealthBeautyItem {
  const deal = RECOMMENDED_DEALS_POOL.find((d) => d.id === dealId);
  if (!deal) throw new Error("Recommended deal not found");

  const catalogItem: HealthBeautyItem = {
    id: deal.id,
    slug: deal.id.replace("deal-", ""),
    name: deal.name,
    brand: deal.brand,
    category: deal.category,
    type: "affiliate",
    priceUsd: deal.dealPriceUsd,
    priceInr: deal.dealPriceInr,
    storeId: deal.storeId,
    storeName: deal.storeName,
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&auto=format&fit=crop&q=80",
    accent: "from-rose-100 via-amber-50 to-pink-50",
    score: Math.min(99, Math.round(deal.rating * 20)),
    keyBenefit: deal.keyBenefit,
    skinType: deal.skinType,
    shipsWorldwide: deal.shipsWorldwide,
    shipsIndia: deal.shipsIndia,
    shippingNote: deal.shippingNote,
    affiliateUrl: deal.affiliateUrl,
    tag: `${deal.discountPercent}% OFF · Trending Deal`,
    approvedForPublishing: true,
  };

  return catalogItem;
}
