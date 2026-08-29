import { describe, expect, it } from "vitest";
import { saveAwinConfig, saveCjConfig, saveImpactConfig, saveRakutenConfig, testAwinConfig, testCjConfig, testImpactConfig, testRakutenConfig } from "./integrationService";

describe("CJ Affiliate integration", () => {
  const valid = { publisherId: "123456", websiteId: "brandjanra", apiToken: "token-12345678", deepLinkEndpoint: "https://api.cj.com/v3" };
  it("accepts and validates a CJ configuration", () => {
    expect(testCjConfig(valid)).toMatchObject({ ok: true });
    expect(saveCjConfig(valid)).toMatchObject({ ok: true });
  });
  it("rejects incomplete credentials", () => {
    expect(testCjConfig({ ...valid, apiToken: "short" })).toMatchObject({ ok: false });
    expect(testCjConfig({ ...valid, deepLinkEndpoint: "https://example.com/api" })).toMatchObject({ ok: false });
  });
  it("accepts and validates an Awin configuration", () => {
    const awin = { publisherId: "12345", advertiserId: "67890", apiToken: "awin-token-123", deeplinkEndpoint: "https://www.awin1.com/cread.php" };
    expect(testAwinConfig(awin)).toMatchObject({ ok: true });
    expect(saveAwinConfig(awin)).toMatchObject({ ok: true });
  });
  it("accepts and validates a Rakuten Advertising configuration", () => {
    const rakuten = { siteId: "123456", advertiserId: "789012", apiToken: "rakuten-token-123", deeplinkEndpoint: "https://click.linksynergy.com/fs-bin/click" };
    expect(testRakutenConfig(rakuten)).toMatchObject({ ok: true });
    expect(saveRakutenConfig(rakuten)).toMatchObject({ ok: true });
  });
  it("accepts and validates an impact.com configuration", () => {
    const impact = { accountSid: "12345", actionTrackerId: "67890", apiKey: "impact-key-123", deeplinkEndpoint: "https://api.impact.com" };
    expect(testImpactConfig(impact)).toMatchObject({ ok: true });
    expect(saveImpactConfig(impact)).toMatchObject({ ok: true });
  });
});
