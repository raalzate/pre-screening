# Tasks: Candidate Retry System Implementation

- [x] Phase 1: Foundation & API <!-- id: P1 -->
    - [x] T001 Add `retry_count` column to `users` and `history_candidates` in `lib/db.ts` <!-- id: T001 -->
    - [x] T002 Implement POST `/api/user/retry` endpoint for resetting evaluation <!-- id: T002 -->
- [x] Phase 2: UI Components <!-- id: P2 -->
    - [x] T003 Create `RetryButton` component in `components/evaluation/` <!-- id: T003 -->
    - [x] T004 Integrate `RetryButton` in `components/DynamicForm.tsx` (Rejection View) <!-- id: T004 -->
    - [x] T005 Integrate `RetryButton` in `app/(protected)/page.tsx` (Feedback View) <!-- id: T005 -->
- [x] Phase 3: Validation <!-- id: P3 -->
    - [x] T006 Verify the 3-retry limit and data reset functionality <!-- id: T006 -->
    - [x] T007 Run final build and lint checks <!-- id: T007 -->
