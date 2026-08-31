import { HEALTH_BEAUTY_CATALOG, HealthBeautyItem } from "../shared/commerce.js";
import { createContentDraft } from "../shared/content.js";
import { publishToFacebook, publishToInstagram, PublishResult } from "./socialService.js";

export interface ScheduledSocialPost {
  id: string;
  productSlug: string;
  productName: string;
  brand: string;
  category: string;
  platforms: ("facebook" | "instagram" | "youtube")[];
  scheduledSlot: "morning" | "afternoon" | "evening" | "instant";
  status: "queued" | "published" | "failed";
  generatedPayloads: {
    facebook?: {
      caption: string;
      link: string;
    };
    instagram?: {
      script: string;
      caption: string;
    };
    youtube?: {
      title: string;
      script: string;
      description: string;
    };
  };
  results?: PublishResult[];
  publishedAt?: string;
}

const scheduledQueue: ScheduledSocialPost[] = [];

export function initializeSchedulerQueue(): ScheduledSocialPost[] {
  const approved = HEALTH_BEAUTY_CATALOG.filter((p) => p.approvedForPublishing);
  const slots: ("morning" | "afternoon" | "evening" | "instant")[] = ["morning", "afternoon", "evening", "morning", "afternoon"];

  approved.forEach((product, idx) => {
    const slot = slots[idx % slots.length];
    const fbDraft = createContentDraft({
      productName: product.name,
      brand: product.brand,
      category: product.category,
      reasonToConsider: product.keyBenefit,
      productSlug: product.slug,
      source: "facebook",
      campaign: "brand_janra_schedule",
      affiliate: true,
      shippingNote: product.shippingNote,
    });

    const igDraft = createContentDraft({
      productName: product.name,
      brand: product.brand,
      category: product.category,
      reasonToConsider: product.keyBenefit,
      productSlug: product.slug,
      source: "instagram",
      campaign: "brand_janra_schedule",
      affiliate: true,
      shippingNote: product.shippingNote,
    });

    const ytDraft = createContentDraft({
      productName: product.name,
      brand: product.brand,
      category: product.category,
      reasonToConsider: product.keyBenefit,
      productSlug: product.slug,
      source: "youtube",
      campaign: "brand_janra_schedule",
      affiliate: true,
      shippingNote: product.shippingNote,
    });

    scheduledQueue.push({
      id: `SCHED_${product.slug}_${Date.now()}`,
      productSlug: product.slug,
      productName: product.name,
      brand: product.brand,
      category: product.category,
      platforms: ["facebook", "instagram", "youtube"],
      scheduledSlot: slot,
      status: "queued",
      generatedPayloads: {
        facebook: {
          caption: fbDraft.caption,
          link: fbDraft.trackingUrl,
        },
        instagram: {
          script: igDraft.script || "",
          caption: igDraft.caption,
        },
        youtube: {
          title: ytDraft.title,
          script: ytDraft.script || "",
          description: ytDraft.caption,
        },
      },
    });
  });

  return scheduledQueue;
}

export function getSchedulerQueue() {
  if (scheduledQueue.length === 0) {
    initializeSchedulerQueue();
  }
  return scheduledQueue;
}

export async function executeScheduledPost(postId: string) {
  const post = scheduledQueue.find((p) => p.id === postId);
  if (!post) throw new Error("Scheduled post not found");

  const results: PublishResult[] = [];

  if (post.platforms.includes("facebook") && post.generatedPayloads.facebook) {
    const fbRes = await publishToFacebook({
      message: post.generatedPayloads.facebook.caption,
      link: post.generatedPayloads.facebook.link,
      productName: post.productName,
    });
    results.push(fbRes);
  }

  if (post.platforms.includes("instagram") && post.generatedPayloads.instagram) {
    const igRes = await publishToInstagram({
      caption: post.generatedPayloads.instagram.caption,
      mediaType: "IMAGE",
    });
    results.push(igRes);
  }

  post.status = results.every((r) => r.success) ? "published" : "failed";
  post.results = results;
  post.publishedAt = new Date().toISOString();

  return {
    success: post.status === "published",
    post,
    results,
  };
}

export async function executeAllQueuedPosts() {
  const queue = getSchedulerQueue();
  const executionResults = [];

  for (const post of queue.filter((p) => p.status === "queued")) {
    const res = await executeScheduledPost(post.id);
    executionResults.push(res);
  }

  return {
    totalExecuted: executionResults.length,
    success: executionResults.every((r) => r.success),
    executionResults,
  };
}
