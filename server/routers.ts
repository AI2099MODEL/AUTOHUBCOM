import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getActiveProducts, getAttributionSummary, getContentPackages } from "./db";
import { createDirectOrder, getAnalyticsSummary, getProductBySlug } from "./commerceService";

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
});

export type AppRouter = typeof appRouter;
