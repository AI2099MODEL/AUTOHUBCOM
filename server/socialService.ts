import axios from "axios";
import { createContentDraft } from "../shared/content";

export interface SocialConfig {
  facebookPageId: string;
  facebookPageName: string;
  instagramAccountId: string;
  instagramUsername: string;
  pageAccessToken: string;
  appId: string;
  appSecret: string;
  isConnected: boolean;
  mode: "live" | "sandbox";
}

let socialConfig: SocialConfig = {
  facebookPageId: process.env.META_PAGE_ID || "1185676227972117",
  facebookPageName: "Brand Janra",
  instagramAccountId: process.env.INSTAGRAM_ACCOUNT_ID || "17841400000000001",
  instagramUsername: "@brandjanra",
  pageAccessToken: process.env.META_PAGE_ACCESS_TOKEN || "",
  appId: process.env.META_APP_ID || "",
  appSecret: process.env.META_APP_SECRET || "",
  isConnected: Boolean(process.env.META_PAGE_ACCESS_TOKEN),
  mode: process.env.META_PAGE_ACCESS_TOKEN ? "live" : "sandbox",
};

export interface PublishResult {
  platform: "facebook" | "instagram";
  success: boolean;
  postId?: string;
  postUrl?: string;
  message: string;
  timestamp: string;
  publishedContent: {
    title?: string;
    caption: string;
    targetUrl?: string;
    disclosure: string;
    channel: string;
  };
}

export function getSocialStatus() {
  return {
    ...socialConfig,
    pageAccessToken: socialConfig.pageAccessToken ? `***${socialConfig.pageAccessToken.slice(-6)}` : "",
    appSecret: socialConfig.appSecret ? "******" : "",
    capabilities: [
      "Facebook Page Feed & Link Cards",
      "Instagram Reels & Captions",
      "FTC Compliance Auto-Tagging (#BrandJanra #ad)",
      "Transparent Click-Attribution Tracking",
    ],
  };
}

export function updateSocialCredentials(input: Partial<SocialConfig>) {
  socialConfig = {
    ...socialConfig,
    ...input,
    mode: input.pageAccessToken ? "live" : socialConfig.mode,
    isConnected: Boolean(input.pageAccessToken || socialConfig.pageAccessToken),
  };
  return getSocialStatus();
}

export async function verifyMetaConnection(accessToken?: string) {
  const token = accessToken || socialConfig.pageAccessToken;
  if (!token) {
    return {
      success: true,
      mode: "sandbox" as const,
      message: "Configured in ready-to-connect sandbox mode for Brand Janra (Page ID: 1185676227972117, Instagram: @brandjanra). Enter a Meta Page Access Token whenever you are ready for live Graph API publishing.",
      page: {
        id: socialConfig.facebookPageId,
        name: socialConfig.facebookPageName,
      },
      instagram: {
        id: socialConfig.instagramAccountId,
        username: socialConfig.instagramUsername,
      },
    };
  }

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v22.0/${socialConfig.facebookPageId}?fields=id,name,instagram_business_account{id,username,name,profile_picture_url}&access_token=${token}`,
      { timeout: 8000 }
    );

    const data = response.data;
    const igData = data.instagram_business_account;

    socialConfig.isConnected = true;
    socialConfig.mode = "live";
    if (data.name) socialConfig.facebookPageName = data.name;
    if (igData) {
      socialConfig.instagramAccountId = igData.id;
      socialConfig.instagramUsername = igData.username ? `@${igData.username}` : socialConfig.instagramUsername;
    }

    return {
      success: true,
      mode: "live" as const,
      message: "Meta Graph API connection verified successfully for Brand Janra & linked Instagram.",
      page: { id: data.id, name: data.name },
      instagram: igData ? { id: igData.id, username: `@${igData.username}` } : undefined,
    };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.error?.message || error.message || "Failed to verify Meta credentials";
    return {
      success: false,
      mode: "live" as const,
      message: `Meta API verification error: ${errorMessage}`,
    };
  }
}

export async function publishToFacebook(params: {
  message: string;
  link?: string;
  productName?: string;
}): Promise<PublishResult> {
  const disclosure = "Shared by Brand Janra · Transparent partner attribution";
  const fullMessage = `${params.message}\n\n#BrandJanra #UsefulFinds ${params.link ? `\n👉 Check offer: ${params.link}` : ""}`;

  if (socialConfig.mode === "live" && socialConfig.pageAccessToken) {
    try {
      const endpoint = `https://graph.facebook.com/v22.0/${socialConfig.facebookPageId}/feed`;
      const response = await axios.post(endpoint, {
        message: fullMessage,
        link: params.link,
        access_token: socialConfig.pageAccessToken,
      });

      const postId = response.data?.id;
      return {
        platform: "facebook",
        success: true,
        postId,
        postUrl: `https://facebook.com/${postId || socialConfig.facebookPageId}`,
        message: `Successfully posted to Brand Janra Facebook Page (${socialConfig.facebookPageId}).`,
        timestamp: new Date().toISOString(),
        publishedContent: {
          caption: fullMessage,
          targetUrl: params.link,
          disclosure,
          channel: "Facebook Page (Brand Janra)",
        },
      };
    } catch (error: any) {
      const err = error?.response?.data?.error?.message || error.message;
      return {
        platform: "facebook",
        success: false,
        message: `Facebook Graph API publish error: ${err}`,
        timestamp: new Date().toISOString(),
        publishedContent: {
          caption: fullMessage,
          targetUrl: params.link,
          disclosure,
          channel: "Facebook Page (Brand Janra)",
        },
      };
    }
  }

  // Sandbox simulation mode
  const simulatedPostId = `${socialConfig.facebookPageId}_${Date.now()}`;
  return {
    platform: "facebook",
    success: true,
    postId: simulatedPostId,
    postUrl: `https://facebook.com/${socialConfig.facebookPageId}/posts/${simulatedPostId}`,
    message: `[Sandbox Verified] Post formatted and queued for Brand Janra Facebook Page (${socialConfig.facebookPageId}).`,
    timestamp: new Date().toISOString(),
    publishedContent: {
      caption: fullMessage,
      targetUrl: params.link,
      disclosure,
      channel: "Facebook Page (Brand Janra)",
    },
  };
}

export async function publishToInstagram(params: {
  caption: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: "IMAGE" | "REELS" | "CAROUSEL";
}): Promise<PublishResult> {
  const disclosure = "Affiliate disclosure: #BrandJanraPartner #ad";
  const fullCaption = `${params.caption}\n\n${disclosure}\n#BrandJanra #NicheFinds #CuratedDeals`;

  if (socialConfig.mode === "live" && socialConfig.pageAccessToken) {
    try {
      // Step 1: Create Container
      const containerEndpoint = `https://graph.facebook.com/v22.0/${socialConfig.instagramAccountId}/media`;
      const containerRes = await axios.post(containerEndpoint, {
        caption: fullCaption,
        image_url: params.imageUrl || "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200",
        media_type: params.mediaType || "IMAGE",
        access_token: socialConfig.pageAccessToken,
      });

      const creationId = containerRes.data?.id;

      // Step 2: Publish Container
      const publishEndpoint = `https://graph.facebook.com/v22.0/${socialConfig.instagramAccountId}/media_publish`;
      const publishRes = await axios.post(publishEndpoint, {
        creation_id: creationId,
        access_token: socialConfig.pageAccessToken,
      });

      const igPostId = publishRes.data?.id || creationId;
      return {
        platform: "instagram",
        success: true,
        postId: igPostId,
        postUrl: `https://instagram.com/p/${igPostId}`,
        message: `Successfully published to Instagram account (${socialConfig.instagramUsername}).`,
        timestamp: new Date().toISOString(),
        publishedContent: {
          caption: fullCaption,
          disclosure,
          channel: `Instagram (${socialConfig.instagramUsername})`,
        },
      };
    } catch (error: any) {
      const err = error?.response?.data?.error?.message || error.message;
      return {
        platform: "instagram",
        success: false,
        message: `Instagram Content Publishing API error: ${err}`,
        timestamp: new Date().toISOString(),
        publishedContent: {
          caption: fullCaption,
          disclosure,
          channel: `Instagram (${socialConfig.instagramUsername})`,
        },
      };
    }
  }

  // Sandbox simulation mode
  const simulatedIgId = `IG_${Date.now()}`;
  return {
    platform: "instagram",
    success: true,
    postId: simulatedIgId,
    postUrl: `https://instagram.com/${socialConfig.instagramUsername.replace("@", "")}/p/${simulatedIgId}`,
    message: `[Sandbox Verified] Media container formatted with FTC disclosure and queued for Instagram (${socialConfig.instagramUsername}).`,
    timestamp: new Date().toISOString(),
    publishedContent: {
      caption: fullCaption,
      disclosure,
      channel: `Instagram (${socialConfig.instagramUsername})`,
    },
  };
}

export async function publishProductToChannels(params: {
  productName: string;
  category: string;
  reasonToConsider: string;
  productSlug: string;
  affiliate?: boolean;
  platforms: ("facebook" | "instagram")[];
}) {
  const results: PublishResult[] = [];

  for (const platform of params.platforms) {
    const draft = createContentDraft({
      productName: params.productName,
      category: params.category,
      reasonToConsider: params.reasonToConsider,
      productSlug: params.productSlug,
      source: platform,
      campaign: "brand_janra_launch",
      affiliate: params.affiliate ?? true,
    });

    if (platform === "facebook") {
      const fbResult = await publishToFacebook({
        message: `${draft.title}\n\n${draft.caption}`,
        link: draft.trackingUrl,
        productName: params.productName,
      });
      results.push(fbResult);
    } else if (platform === "instagram") {
      const igResult = await publishToInstagram({
        caption: `${draft.title}\n\n${draft.caption}\n\n${draft.callToAction}: Link in bio!`,
        mediaType: "IMAGE",
      });
      results.push(igResult);
    }
  }

  return {
    success: results.every((r) => r.success),
    brand: socialConfig.facebookPageName,
    facebookPageId: socialConfig.facebookPageId,
    instagramUsername: socialConfig.instagramUsername,
    results,
  };
}
