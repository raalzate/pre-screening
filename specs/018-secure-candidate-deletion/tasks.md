# Tasks: Secure Candidate Deletion

**Input**: Design documents from `/specs/018-secure-candidate-deletion/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/delete.md

**Tests**: Tests are generated as requested by the "Why this priority" and "Independent Test" sections of the spec.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Verify environment variables for SMTP (SMTP_HOST, SMTP_USER, SMTP_PASS) in config.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T002 Update `lib/db.ts` to include `CANDIDATE_DELETED` notification type
- [ ] T003 Implement `deleteCandidatePermanently` helper in `lib/db.ts`
- [ ] T004 Implement `sendCandidateDeletionEmail` helper in `lib/email.ts` using `getSofkaTemplate`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Secure Deletion with Default Reason (Priority: P1) 🎯 MVP

**Goal**: Delete candidate record using a predefined reason and notify them.

**Independent Test**: Delete a candidate with "Position closed" and verify:
1. Candidate is gone from `users` table.
2. `admin_notifications` has a logout entry.
3. Email is dispatched (or logged in dev).

### Implementation for User Story 1

- [ ] T005 [P] [US1] Create confirmation dialog base `app/(protected)/admin/candidates/components/DeleteCandidateDialog.tsx`
- [ ] T006 [US1] Implement deletion logic in API route `app/api/admin/candidates/delete/route.ts`
- [ ] T007 [US1] Integrate `DeleteCandidateDialog` into candidate management UI in `app/(protected)/admin/page.tsx`
- [ ] T008 [US1] Add audit logging to deletion route using `createAdminNotification` in `app/api/admin/candidates/delete/route.ts`

**Checkpoint**: User Story 1 functional and testable independently.

---

## Phase 4: User Story 2 - Secure Deletion with Custom Reason (Priority: P2)

**Goal**: Provide a custom reason for deletion when predefined options don't apply.

**Independent Test**: Use the "Custom" option in the dialog, type a specific reason, and verify it appears in the notification email.

### Implementation for User Story 2

- [ ] T009 [US2] Update `DeleteCandidateDialog.tsx` to include "Other" reason as an option with a text input.
- [ ] T010 [US2] Update API route `app/api/admin/candidates/delete/route.ts` to handle `customReason` payload.
- [ ] T011 [US2] Ensure email notification includes the custom reason if provided in `app/api/admin/candidates/delete/route.ts`.

**Checkpoint**: User Story 2 functional and testable independently.

---

## Phase 5: User Story 3 - Unauthorized Access Prevention (Priority: P1)

**Goal**: Ensure only authorized administrators can delete candidates.

**Independent Test**: Attempt to call the deletion endpoint with a non-admin session and verify it returns a 403 error.

### Implementation for User Story 3

- [ ] T012 [US3] Implement admin role check in `app/api/admin/candidates/delete/route.ts` using `getServerSession(authOptions)`.

**Checkpoint**: Security is verified and enforced.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T013 [P] Update documentation in `quickstart.md` with final API details
- [ ] T014 Run `npm run lint` and `npm run build` to ensure project stability
- [ ] T015 Verify edge cases (e.g., email service failure, non-existent candidate code)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Completion order

- **US1 (P1)** → **US2 (P2)** (US2 builds on the dialog from US1)
- **US3 (P1)** (Can be done concurrently with or after US1/US2 implementation in the route)

---

## Parallel Example: User Story 1

```bash
# Foundational tasks can run after Phase 1:
Task: "Update lib/db.ts to include CANDIDATE_DELETED notification type"
Task: "Implement sendCandidateDeletionEmail helper in lib/email.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational.
2. Implement US1: Basic UI dialog + Deletion route with default reason.
3. Validate US1 independently.

### Incremental Delivery

1. Foundation ready.
2. Add US3 (Security) to the route to ensure baseline safety.
3. Deliver US1 (MVP).
4. Add US2 (Custom reasons) for flexibility.
