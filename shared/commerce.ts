export type OfferSignals = {
  profitability: number;
  availability: number;
  audienceFit: number;
  claimSafety: number;
};

export function scoreOffer(signals: OfferSignals) {
  const values = Object.values(signals);
  const clamped = values.map((value) => Math.max(0, Math.min(100, value)));
  return Math.round(clamped.reduce((total, value) => total + value, 0) / clamped.length);
}

export function hasRequiredDisclosure(content: string, isAffiliate: boolean) {
  if (!isAffiliate) return true;
  const normalized = content.toLowerCase();
  return normalized.includes("affiliate") || normalized.includes("commission") || normalized.includes("partner link");
}

export function canPublishOffer(input: { destinationReachable: boolean; inStock: boolean; claimSafetyApproved: boolean; content: string; isAffiliate: boolean }) {
  return input.destinationReachable && input.inStock && input.claimSafetyApproved && hasRequiredDisclosure(input.content, input.isAffiliate);
}

export function buildTrackedPath(productSlug: string, source: string, campaign: string) {
  const params = new URLSearchParams({ src: source, campaign });
  return `/go/${encodeURIComponent(productSlug)}?${params.toString()}`;
}
