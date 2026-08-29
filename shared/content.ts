import { buildTrackedPath } from "./commerce";

export type ContentDraftInput = { productName: string; category: string; reasonToConsider: string; productSlug: string; source: "instagram" | "facebook" | "youtube"; campaign: string; affiliate: boolean };

export function createContentDraft(input: ContentDraftInput) {
  const disclosure = input.affiliate ? "Affiliate disclosure: We may earn a commission if you purchase through this partner link." : "Direct-purchase product from our store.";
  const trackingUrl = buildTrackedPath(input.productSlug, input.source, input.campaign);
  if (input.source === "instagram") return { title: `${input.productName}: the useful detail`, script: `Hook: One small ${input.category.toLowerCase()} upgrade worth a closer look.\nContext: ${input.reasonToConsider}\nCTA: Save this edit and check the tracked link in our profile.`, caption: `${input.reasonToConsider} ${disclosure}`, callToAction: "See the tracked offer", disclosure, trackingUrl };
  if (input.source === "youtube") return { title: `${input.productName} — what to know before you buy`, script: `Opening: Here is the practical reason we shortlisted this ${input.category.toLowerCase()} product.\nMain point: ${input.reasonToConsider}\nClose: Check the description for the tracked destination and current availability.`, caption: `${input.reasonToConsider}\n\n${disclosure}`, callToAction: "Check the current offer in the description", disclosure, trackingUrl };
  return { title: `A useful ${input.category.toLowerCase()} find: ${input.productName}`, script: null, caption: `${input.reasonToConsider} Read the details before purchasing. ${disclosure}`, callToAction: "View the current offer", disclosure, trackingUrl };
}
