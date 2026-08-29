import { buildTrackedPath } from "./commerce";

export type ContentDraftInput = {
  productName: string;
  brand?: string;
  category: string;
  reasonToConsider: string;
  productSlug: string;
  source: "instagram" | "facebook" | "youtube";
  campaign: string;
  affiliate: boolean;
  storeUrl?: string;
  shippingNote?: string;
};

export function createContentDraft(input: ContentDraftInput) {
  const disclosure = input.affiliate
    ? "Affiliate disclosure: #BrandJanraPartner #ad. We may earn a commission from purchases at no extra cost to you."
    : "Direct-purchase product curated by Brand Janra.";

  const trackingUrl = `https://brandjanra.vercel.app${buildTrackedPath(input.productSlug, input.source, input.campaign)}`;
  const storeNote = input.shippingNote ? `\n📦 Delivery: ${input.shippingNote}` : "";

  if (input.source === "instagram") {
    return {
      title: `${input.productName} by ${input.brand || "Brand Janra"}: The Skincare Edit`,
      script: `🎬 [0-3s Hook]: Stop scrolling if you have dull skin or weak hair barrier.\n🧴 [3-15s Benefit]: ${input.reasonToConsider}\n✨ [15-25s Fit]: Why we shortlisted this for Brand Janra's daily edit.\n🔗 [25-30s CTA]: Tap the link in our bio (@brandjanra) to see current deals & transparent shipping rates!`,
      caption: `Looking for glass skin or healthy hair? Here's why ${input.productName} made our curated health & beauty edit today.\n\n✨ Key Highlight: ${input.reasonToConsider}${storeNote}\n\n👉 Tap link in bio (@brandjanra) to shop with transparent shipping rates!\n\n${disclosure}\n#BrandJanra #HealthAndBeauty #SkincareRoutine #HaircareHacks #NicheFinds #BeautyDeals`,
      callToAction: "See tracked offer (Link in bio)",
      disclosure,
      trackingUrl,
    };
  }

  if (input.source === "youtube") {
    return {
      title: `${input.productName} Review & Worth It? — Brand Janra Health & Beauty Edit #Shorts`,
      script: `[Opening Hook]: Is ${input.productName} actually worth the hype?\n[Demonstration & Key Benefit]: ${input.reasonToConsider}\n[Shipping & Pricing]: Verified available with worldwide and India shipping options.\n[Close]: Link in the pinned comment & description below!`,
      caption: `Curated Health & Beauty Review: ${input.productName} by ${input.brand || "Brand Janra"}.\n\n📌 What it does: ${input.reasonToConsider}${storeNote}\n\n🛒 Check verified offer & live shipping charges:\n👉 ${trackingUrl}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${disclosure}\nSubscribe to @brandjanra for daily useful finds & transparent beauty reviews.\n#Shorts #Skincare #Beauty #BrandJanra #TrendingBeauty`,
      callToAction: "Check verified deal in description & pinned comment",
      disclosure,
      trackingUrl,
    };
  }

  // Facebook Page
  return {
    title: `Curated Find: ${input.productName} (${input.brand || "Brand Janra"})`,
    script: null,
    caption: `🌿 Discover why ${input.productName} is in our top health & beauty edit today.\n\n✨ ${input.reasonToConsider}${storeNote}\n\n👉 Check the verified merchant offer & shipping options here:\n🔗 ${trackingUrl}\n\n${disclosure}\n#BrandJanra #UsefulFinds #Skincare #BeautyDeals #CuratedHealth`,
    callToAction: "View verified merchant offer",
    disclosure,
    trackingUrl,
  };
}
