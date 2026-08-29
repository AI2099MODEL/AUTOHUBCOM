import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getActiveProducts, getAttributionSummary, getContentPackages } from "./db";
import { createDirectOrder, getAnalyticsSummary, getProductBySlug } from "./commerceService";

import {
  getSocialStatus,
  publishProductToChannels,
  publishToFacebook,
  publishToInstagram,
  updateSocialCredentials,
  verifyMetaConnection,
} from "./socialService";

import {
  executeAllQueuedPosts,
  executeScheduledPost,
  getSchedulerQueue,
} from "./socialScheduler";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  catalog: router({
    active: publicProcedure.query(() => getActiveProducts()),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(160) })).query(({ input }) => getProductBySlug(input.slug)),
    createDirectOrder: publicProcedure.input(z.object({ slug: z.string().min(1), customerName: z.string().trim().min(2).max(160), customerEmail: z.string().email().max(320), consentGiven: z.boolean() })).mutation(({ input }) => createDirectOrder(input)),
  }),
  operations: router({
    contentPackages: protectedProcedure.input(z.object({})).query(() => getContentPackages()),
    attributionSummary: protectedProcedure.query(() => getAttributionSummary()),
    analyticsSummary: protectedProcedure.query(() => getAnalyticsSummary()),
  }),
  social: router({
    status: publicProcedure.query(() => getSocialStatus()),
    getQueue: publicProcedure.query(() => getSchedulerQueue()),
    executeScheduled: publicProcedure
      .input(z.object({ postId: z.string() }))
      .mutation(({ input }) => executeScheduledPost(input.postId)),
    executeAllQueued: publicProcedure.mutation(() => executeAllQueuedPosts()),
    verify: publicProcedure
      .input(z.object({ accessToken: z.string().optional() }))
      .mutation(({ input }) => verifyMetaConnection(input.accessToken)),
    updateCredentials: publicProcedure
      .input(
        z.object({
          facebookPageId: z.string().optional(),
          facebookPageName: z.string().optional(),
          instagramUsername: z.string().optional(),
          instagramAccountId: z.string().optional(),
          pageAccessToken: z.string().optional(),
          appId: z.string().optional(),
          appSecret: z.string().optional(),
        })
      )
      .mutation(({ input }) => updateSocialCredentials(input)),
    publishProduct: publicProcedure
      .input(
        z.object({
          productName: z.string().min(1),
          category: z.string().min(1),
          reasonToConsider: z.string().min(1),
          productSlug: z.string().min(1),
          affiliate: z.boolean().optional(),
          platforms: z.array(z.enum(["facebook", "instagram"])),
        })
      )
      .mutation(({ input }) => publishProductToChannels(input)),
    publishCustom: publicProcedure
      .input(
        z.object({
          platform: z.enum(["facebook", "instagram"]),
          message: z.string().min(1),
          link: z.string().optional(),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        if (input.platform === "facebook") {
          return publishToFacebook({ message: input.message, link: input.link });
        } else {
          return publishToInstagram({ caption: input.message, imageUrl: input.imageUrl });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
