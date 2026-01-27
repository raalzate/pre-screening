# Tasks: Multi-Profile Selection

## Phase 1: Database Migration & Schema
- [x] T001 Update `lib/db.ts` to implement the new `users` schema with composite primary key (`code`, `requirements`).
- [x] T002 Implement `initDb` logic to migrate existing users or recreate the table if needed (safely).
- [x] T003 Ensure `history_candidates` table also reflects the new composite key structure.

## Phase 2: Backend Logic
- [x] T004 Update `/api/user/verify` to return a list of profiles when multiple matches are found for a code.
- [x] T005 Update `/api/evaluation` to handle context-aware submissions (ensure correct `requirements` is used).

## Phase 3: Frontend Selection UI
- [x] T006 Create `components/ProfileSelector.tsx` to display available profiles.
- [x] T007 Update `app/(public)/welcome/page.tsx` (or entry point) to detect multi-profile response and render `ProfileSelector`.
- [x] T008 Implement selection logic: User clicks profile -> App sets session/context -> Redirects to assessment.

## Phase 4: Verification
- [x] T009 Create a test script to Seed a multi-profile user.
- [x] T010 Verify API returns list.
- [x] T011 Manual verify UI flow.
