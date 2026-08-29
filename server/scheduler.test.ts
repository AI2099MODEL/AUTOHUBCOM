import { describe, expect, it } from "vitest";
import {
  executeAllQueuedPosts,
  executeScheduledPost,
  getSchedulerQueue,
} from "./socialScheduler";

describe("Social Media Multi-Channel Scheduler (FB, IG, YT)", () => {
  it("should initialize the queue with all approved health and beauty products", () => {
    const queue = getSchedulerQueue();
    expect(queue.length).toBeGreaterThanOrEqual(5);

    // Verify Ashwagandha is not in the queue
    const ashwagandha = queue.find((p) => p.productSlug.includes("ashwagandha"));
    expect(ashwagandha).toBeUndefined();
  });

  it("should generate YouTube Shorts scripts with tracked Vercel URLs", () => {
    const queue = getSchedulerQueue();
    const cosrx = queue.find((p) => p.productSlug === "cosrx-snail-mucin-essence");

    expect(cosrx).toBeDefined();
    expect(cosrx?.generatedPayloads.youtube).toBeDefined();
    expect(cosrx?.generatedPayloads.youtube?.title).toContain("Shorts");
    expect(cosrx?.generatedPayloads.youtube?.description).toContain("brandjanra.vercel.app");
    expect(cosrx?.generatedPayloads.youtube?.description).toContain("#BrandJanraPartner #ad");
  });

  it("should generate Instagram Reel scripts with bio link call-to-action", () => {
    const queue = getSchedulerQueue();
    const ordinary = queue.find((p) => p.productSlug === "the-ordinary-niacinamide-zinc");

    expect(ordinary).toBeDefined();
    expect(ordinary?.generatedPayloads.instagram?.script).toContain("Hook");
    expect(ordinary?.generatedPayloads.instagram?.caption).toContain("@brandjanra");
  });

  it("should execute a scheduled post for Facebook and Instagram", async () => {
    const queue = getSchedulerQueue();
    const firstPost = queue[0];

    const result = await executeScheduledPost(firstPost.id);
    expect(result.success).toBe(true);
    expect(result.post.status).toBe("published");
    expect(result.results.length).toBeGreaterThan(0);
  });

  it("should batch execute all queued posts cleanly", async () => {
    const batchResult = await executeAllQueuedPosts();
    expect(batchResult.success).toBe(true);
    expect(batchResult.totalExecuted).toBeGreaterThanOrEqual(1);
  });
});
