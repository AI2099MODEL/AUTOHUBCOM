import { describe, expect, it } from "vitest";
import {
  getSocialStatus,
  publishProductToChannels,
  publishToFacebook,
  publishToInstagram,
  updateSocialCredentials,
  verifyMetaConnection,
} from "./socialService";

describe("Brand Janra Facebook & Instagram Social Integration", () => {
  it("should initialize with Brand Janra details and Facebook Page ID 1185676227972117", () => {
    const status = getSocialStatus();
    expect(status.facebookPageId).toBe("1185676227972117");
    expect(status.facebookPageName).toBe("Brand Janra");
    expect(status.instagramUsername).toBe("@brandjanra");
    expect(status.capabilities.length).toBeGreaterThan(0);
  });

  it("should verify connection in ready sandbox mode when no token is present", async () => {
    const result = await verifyMetaConnection();
    expect(result.success).toBe(true);
    expect(result.page?.id).toBe("1185676227972117");
    expect(result.page?.name).toBe("Brand Janra");
    expect(result.instagram?.username).toBe("@brandjanra");
  });

  it("should format and publish a Facebook Page feed post with tracking link", async () => {
    const res = await publishToFacebook({
      message: "Check out this curated find for your workspace.",
      link: "/r/halo-desk-light?src=facebook&cmp=daily_edit",
      productName: "Halo Desk Light",
    });

    expect(res.success).toBe(true);
    expect(res.platform).toBe("facebook");
    expect(res.publishedContent.caption).toContain("#BrandJanra");
    expect(res.publishedContent.targetUrl).toContain("halo-desk-light");
    expect(res.postId).toBeDefined();
  });

  it("should format and publish an Instagram post with FTC compliance tag", async () => {
    const res = await publishToInstagram({
      caption: "A softer workspace starts with one small change.",
      mediaType: "IMAGE",
    });

    expect(res.success).toBe(true);
    expect(res.platform).toBe("instagram");
    expect(res.publishedContent.disclosure).toContain("#BrandJanraPartner #ad");
    expect(res.postId).toBeDefined();
  });

  it("should publish a multi-channel product package to Facebook and Instagram", async () => {
    const res = await publishProductToChannels({
      productName: "Halo Desk Light",
      category: "Workspace",
      reasonToConsider: "Compact illumination with warm color temperatures.",
      productSlug: "halo-desk-light",
      affiliate: true,
      platforms: ["facebook", "instagram"],
    });

    expect(res.success).toBe(true);
    expect(res.brand).toBe("Brand Janra");
    expect(res.results).toHaveLength(2);
    expect(res.results[0].platform).toBe("facebook");
    expect(res.results[1].platform).toBe("instagram");
  });

  it("should allow updating credentials", () => {
    const updated = updateSocialCredentials({
      facebookPageName: "Brand Janra Official",
      instagramUsername: "@brandjanra_shop",
    });

    expect(updated.facebookPageName).toBe("Brand Janra Official");
    expect(updated.instagramUsername).toBe("@brandjanra_shop");

    // Revert back
    updateSocialCredentials({
      facebookPageName: "Brand Janra",
      instagramUsername: "@brandjanra",
    });
  });
});
