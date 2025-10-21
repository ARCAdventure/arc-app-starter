# ARC (Adventure Rescue Companion) — Starter

This is a starter for the ARC MVP: Expo (React Native) app + Supabase Edge Functions + SQL schema.

## Quickstart
1. Install deps:
   ```bash
   cd mobile
   npm i
   npm run start
   ```
2. Create a Supabase project and set env in `.env` or app.json extra.
3. Deploy edge functions in `supabase/functions`.

## Folders
- `mobile/` — Expo app (Expo Router). Local SQLite stores plans; background task logs breadcrumbs.
- `supabase/functions/` — Edge Functions (overdue watchdog, mark-safe, heartbeat, share).
- `supabase/sql/` — Postgres schema (tables + RLS).

## Notes
- This is an MVP skeleton; fill in API calls to Supabase and the notification queues.
