# Tasks: Candidate Reminder System

**Feature**: Candidate Reminder System
**Implementation Strategy**: Incremental Delivery (Setup -> Foundational -> US1/3 -> US2 -> Polish)

## Phase 1: Setup

- [x] T001 Execute DB migration for `reminder_count` and `last_reminder_at` fields in Turso SQL.
- [x] T002 Update `lib/config.ts` to include SMTP variables in the configuration schema.

## Phase 2: Foundational

- [x] T003 Implement `sendCandidateReminderEmail` in `lib/email.ts` using `nodemailer`.
- [x] T004 Create `POST /api/admin/reminders` API route in `app/api/admin/reminders/route.ts`.

## Phase 3: User Story 1 & 3 - Visibility and Manual Reminder

**Goal**: Admins can see reminder stats and trigger manual reminders.
**Independent Test**: Verify reminder count increases in dashboard and email is received after clicking "Send Reminder".

- [x] T005 [P] [US3] Update `app/(public)/admin/page.tsx` to display `reminder_count` and `last_reminder_at` in the candidate list.
- [x] T006 [US1] Add "Send Reminder" button components to candidate rows in `app/(public)/admin/page.tsx`.
- [x] T007 [US1] Integrate "Send Reminder" button with the `POST /api/admin/reminders` endpoint.

## Phase 4: User Story 2 - Candidate Deletion

**Goal**: Admins can delete inactive candidates who have received many reminders.
**Independent Test**: Verify candidate record is removed from DB/UI only if `reminder_count >= 3`.

- [x] T008 [US2] Implement `DELETE /api/admin/candidates/[code]` in `app/api/admin/candidates/[code]/route.ts` with 3-reminder guard.
- [x] T009 [P] [US2] Add "Delete" button to candidate rows in dashboard, enabled only if `reminder_count >= 3`.
- [x] T010 [US2] Implement a confirmation modal for the deletion action in the admin UI.

## Phase 5: Polish & Verification

- [x] T011 Create verification script `scripts/test-candidate-reminders.sh` to test API endpoints.
- [x] T012 Perform full manual verification walkthrough as documented in `plan.md`.
- [x] T013 Final linting and build check (`npm run build`).

## Dependencies

- Phase 2 depends on Phase 1 (Schema exists).
- Phase 3 depends on Phase 2 (Email service exists).
- Phase 4 depends on Phase 3 (Reminder count tracked).

## Parallel Execution

- T005 and T009 can be developed in parallel as they only touch UI components.
