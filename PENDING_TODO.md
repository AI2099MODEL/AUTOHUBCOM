# Brand Janra — Pending implementation checklist

## Current status

The latest Brand Janra source has been synchronized into the Manus-managed project workspace. TypeScript checks, all 11 automated tests, and the production build pass.

**Automatic sync status:** CJ automatic product sync is **not enabled yet**. The endpoint and Control Room status are present, but production CJ credentials and a successful scheduled run are still required. The link-expiry checker is scheduled separately and is registered as `brandjanra-link-expiry-check`.

**Database status:** The application source and Vercel serverless functions now use PostgreSQL (`pg`) and quoted PostgreSQL identifiers. The initial PostgreSQL migration is generated. The current Manus shell still exposes the legacy local database environment, so the migration must be run from the deployment environment after confirming that Vercel `DATABASE_URL` points to the Supabase Transaction Pooler.

**Social profile URLs supplied by the owner:** Facebook: https://www.facebook.com/profile.php?id=61593884283083; Instagram: https://www.instagram.com/brandjanra/; YouTube: https://www.youtube.com/channel/UCb_Bm4zZrEjTDmG7uU-eV2Q. These are public profile destinations, not OAuth credentials; official OAuth connections remain required before publishing.

## Pending work

| Status | Work item | Required action |
|---|---|---|
| Complete | File storage migration | Upload the Janra logo through the Manus project File Storage panel and replace the repository copy with the managed storage URL. |
| Complete | Manus checkpoint | Save a publishable checkpoint after large media is moved to managed storage. |
| Complete | Production database | Complete the managed database schema for products, links, content, publishing, attribution, lifecycle tracking, and social connections. |
| In progress | Supabase migration | Source conversion to PostgreSQL/`pg` and initial migration are complete. Run the generated migration against the Supabase Transaction Pooler URL and verify Vercel connectivity. |
| Pending | CJ automatic sync | Add `CJ_API_TOKEN`, `CJ_PID`, `CJ_COMPANY_ID`, and `CRON_SECRET`; test `/api/scheduled/cj-sync`; then schedule recurring CJ sync. |
| Pending | CJ product validation | Confirm joined advertiser relationships, sync links, verify images/details, and review expired-link handling. |
| Pending | Awin live integration | Add official Awin credentials, advertiser/program identifiers, deeplink generation, catalog retrieval, lifecycle tracking, and connection tests. |
| Pending | Rakuten Advertising live integration | Add official Rakuten credentials, site/advertiser identifiers, deeplink generation, catalog retrieval, lifecycle tracking, and connection tests. |
| Pending | impact.com live integration | Add account SID, action tracker, API credentials, deeplink generation, catalog retrieval, lifecycle tracking, and connection tests. |
| Pending | Meta Business Suite | Configure Meta app credentials, callback URL, Page permissions, and Instagram Professional account access; then test OAuth and publishing. |
| Pending | YouTube Studio | Configure Google OAuth credentials, YouTube Data API, callback URL, channel access, and upload permissions. Use the supplied Brand Janra channel URL as the account reference, then test publishing. |
| Pending | TikTok | Research and configure TikTok Business/Content Posting API approval, OAuth, video upload, and publishing constraints. |
| Pending | Pinterest | Configure Pinterest developer app, OAuth, board permissions, image/video pin creation, and link attribution. |
| Pending | LinkedIn | Configure LinkedIn app approval, organization/page permissions, OAuth, and media publishing. |
| Pending | X | Configure X developer access, OAuth, media upload, post creation, rate limits, and disclosure handling. |
| Pending | Market routing | Add explicit US, Canada, and UK audience/market fields, timezone-aware scheduling, and market-specific affiliate link rules. |
| Pending | Content and UGC workflow | Add content packages, media storage, approval status, affiliate disclosures, platform adaptations, retries, and audit history. |
| Pending | Final launch checks | Test product links, expired links, OAuth refresh, scheduler retries, disclosure placement, mobile layout, and production error handling. |

## Existing registered scheduler

The link-expiry checker is registered and enabled:

```text
Name: brandjanra-link-expiry-check
Task UID: MLDmnRuEzmA3ZoXrg5sFxT
Schedule: 03:00 UTC daily
Callback: /api/scheduled/check-links
```

This job checks links for expiry. It does **not** perform CJ product synchronization.
