# dev-prescreening Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-22

## Active Technologies
- files (JSON in `data/forms/`) (002-admin-view-forms)
- TypeScript / Next.js (App Router) + `@libsql/client` (Turso), `next-auth` (003-move-user-to-history)
- Turso (SQLite/libsql) (003-move-user-to-history)
- Turso (SQLite/libsql) - Schema Migration Required (004-multi-profile-selection)
- TypeScript / Next.js 15 (App Router) + React 19, Recharts, Zod (007-admin-candidate-filters)
- Turso (SQLite) - Read access for candidate lis (007-admin-candidate-filters)
- TypeScript / Next.js 15 (App Router) + `@libsql/client`, `genkit`, `react-markdown` (010-form-analysis-history)
- Turso (LibSQL / SQLite) (010-form-analysis-history)
- TypeScript / Next.js 15 (App Router) + `@libsql/client` (Turso), `next-auth` (015-secure-cert-questions)
- TypeScript / Next.js 15 (App Router) + `@libsql/client` (Turso), `next-auth`, `nodemailer` (016-candidate-reminder-system)
- TypeScript / Next.js 15 (App Router) + React 19 + `next-auth`, `@libsql/client` (Turso) (017-candidate-self-deletion)
- TypeScript / Next.js 15 (App Router) + `@libsql/client` (Turso), `next-auth`, `nodemailer`, `genkit` (for potential email content) (018-secure-candidate-deletion)
- TypeScript / Next.js 15 (App Router) + `@libsql/client` (Turso), `zod`, `next-auth` (019-candidate-retry-system)
- Turso (SQLite/LibSQL) (021-admin-interview-notification)
- TypeScript / Next.js 15 (App Router) + `@genkit-ai/googleai`, `genkit`, `zod`, `@libsql/client` (Turso) (022-ai-rejection-feedback)
- TypeScript / Next.js 15 (App Router) + React 19 + `@libsql/client` (Turso), `genkit`, `@genkit-ai/googleai`, `zod`, `react-markdown` (023-admin-studio-designer)
- Turso (SQLite/LibSQL) - Two new tables: `studio_requirements` and `studio_forms`. (023-admin-studio-designer)
- TypeScript / Next.js 15 (App Router) + `next-auth`, `zod`, `genkit`, `upstash/ratelimit` (candidate for Redis-backed RL) or simple in-memory LRU (024-ai-rate-limiting)
- Turso (SQLite/LibSQL) for persistent configs, Memory/Redis for transient RL buckets (024-ai-rate-limiting)
- TypeScript / Next.js 15 (App Router) + React 19 + Tailwind CSS, `next-auth`, `@libsql/client`, `react-hot-toast` (027-unified-admin-layout)

- TypeScript / Next.js (App Router) + React, Tailwind CSS (for UI) (001-admin-tech-tab-visibility)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript / Next.js (App Router): Follow standard conventions

## Recent Changes
- 027-unified-admin-layout: Added TypeScript / Next.js 15 (App Router) + React 19 + Tailwind CSS, `next-auth`, `@libsql/client`, `react-hot-toast`
- 024-ai-rate-limiting: Added TypeScript / Next.js 15 (App Router) + `next-auth`, `zod`, `genkit`, `upstash/ratelimit` (candidate for Redis-backed RL) or simple in-memory LRU
- 023-admin-studio-designer: Added TypeScript / Next.js 15 (App Router) + React 19 + `@libsql/client` (Turso), `genkit`, `@genkit-ai/googleai`, `zod`, `react-markdown`


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
