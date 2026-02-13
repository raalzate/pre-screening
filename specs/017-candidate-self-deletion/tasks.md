# Tasks: Candidate Self-Deletion

## Phase 1: Database & Foundation

- [x] T001 [FR-003, FR-005] Update `lib/db.ts` to include `admin_notifications` table in `initDb`.
- [x] T002 [FR-003] Implement `moveCandidateToHistory` helper in `lib/db.ts` specifically for withdrawal.
- [x] T003 [FR-005] Implement `createAdminNotification` helper in `lib/db.ts`.

## Phase 2: API Implementation

- [x] T004 [FR-003, FR-004] Create `app/api/user/withdraw/route.ts` (history move + notification + session kill).
- [x] T005 [FR-005] Create `app/api/admin/notifications/route.ts` (GET unread, PUT mark as read).

## Phase 3: Candidate Portal Integration

- [x] T006 [FR-001, FR-002] Implement `WithdrawButton` and confirmation modal in `app/(protected)/page.tsx`.
- [x] T007 [FR-004] Verify session invalidation logic in portal.

## Phase 4: Admin Dashboard Integration

- [x] T008 [FR-005] Implement notification bell/list in `app/(public)/admin/page.tsx`.
- [x] T009 [FR-005] Connect notification UI to the API.

## Phase 5: Verification

- [x] T010 Create automated verification script `scripts/verify-withdrawal.sh`.
- [x] T011 Full manual walkthrough testing.
