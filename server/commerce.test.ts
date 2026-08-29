import { describe, expect, it } from "vitest";
import { buildTrackedPath, canPublishOffer, hasRequiredDisclosure, scoreOffer } from "../shared/commerce";

describe("commerce rules", () => {
  it("scores an offer from bounded signals", () => {
    expect(scoreOffer({ profitability: 90, availability: 80, audienceFit: 70, claimSafety: 100 })).toBe(85);
    expect(scoreOffer({ profitability: 120, availability: -5, audienceFit: 50, claimSafety: 50 })).toBe(50);
  });

  it("requires a visible affiliate disclosure for partner content", () => {
    expect(hasRequiredDisclosure("Affiliate disclosure: we may earn a commission.", true)).toBe(true);
    expect(hasRequiredDisclosure("Limited-time deal — shop now.", true)).toBe(false);
    expect(hasRequiredDisclosure("Limited-time deal — shop now.", false)).toBe(true);
  });

  it("blocks publishing when safety or destination checks fail", () => {
    const base = { destinationReachable: true, inStock: true, claimSafetyApproved: true, content: "Partner link; we may earn a commission.", isAffiliate: true };
    expect(canPublishOffer(base)).toBe(true);
    expect(canPublishOffer({ ...base, destinationReachable: false })).toBe(false);
    expect(canPublishOffer({ ...base, claimSafetyApproved: false })).toBe(false);
    expect(canPublishOffer({ ...base, content: "Shop this product." })).toBe(false);
  });

  it("builds a transparent, attributable redirect path", () => {
    expect(buildTrackedPath("halo desk light", "instagram", "august-edit")).toBe("/go/halo%20desk%20light?src=instagram&campaign=august-edit");
  });
});
