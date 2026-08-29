# Brand Janra deployment and operations checklist

## 1. Configure deployment environment variables

Add these values to the production deployment, without committing them:

```text
PUBLIC_APP_URL=https://brandjanra.vercel.app
CRON_SECRET=<long-random-secret>
META_APP_ID=<Meta app ID>
META_APP_SECRET=<Meta app secret>
YOUTUBE_CLIENT_ID=<Google OAuth client ID>
YOUTUBE_CLIENT_SECRET=<Google OAuth client secret>
DATABASE_URL=<production MySQL/TiDB URL>
```

## 2. Apply the database migration

Apply `drizzle/0003_old_big_bertha.sql` through the production database migration flow. It creates `social_connections` and adds durable lifecycle metadata to `tracked_links`.

## 3. Register OAuth callback URLs

In Meta Developers, add:

```text
https://brandjanra.vercel.app/api/social-oauth
```

In Google Cloud OAuth credentials, add the same callback URL as an authorized redirect URI. The provider is selected by the `provider` query parameter used by the app.

## 4. Deploy and smoke-test

After deployment, verify:

```text
POST https://brandjanra.vercel.app/api/scheduled/check-links
Authorization: Bearer <CRON_SECRET>
```

Expect JSON containing `checked`, `active`, and `expired` counts. Then open Control Room and test the Meta and YouTube OAuth buttons.

## 5. Create the daily expiry schedule

Only after the production endpoint responds successfully, create the platform-managed daily job:

```bash
manus-heartbeat create \
  --name brandjanra-link-expiry-check \
  --cron "0 0 3 * * *" \
  --path /api/scheduled/check-links \
  --description "Check Brand Janra affiliate destinations and mark failed links expired"
```

The expression runs daily at 03:00 UTC. Keep the returned `task_uid` in the operations record. View it later with `manus-heartbeat list` and inspect failures with `manus-heartbeat logs --task-uid <task_uid>`.

## 6. Operate the promotion portfolio

Sync affiliate networks on a controlled cadence, promote only active links, and use the lifecycle counts to pause or replace expired destinations. Keep a human approval step for first-run UGC, regulated claims, and advertiser-sensitive content.
