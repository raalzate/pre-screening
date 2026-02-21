# Tasks: AI Rate Limiting

**Input**: Design documents from `/specs/024-ai-rate-limiting/`
**Prerequisites**: [plan.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/024-ai-rate-limiting/plan.md), [spec.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/024-ai-rate-limiting/spec.md)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database and service initialization

- [X] T001 [P] Create the `ai_rate_limits` table migration logic in `lib/db.ts`
- [X] T002 [P] Implement the `RateLimiter` service in `lib/ia/rateLimiter.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic integration into the AI generator infrastructure

- [X] T003 Integrate authentication check and `RateLimiter` call into `BaseGenerator.generate()` in `lib/ia/baseGenerator.ts`
- [X] T004 Define the custom `RateLimitError` class for 429 and 401 handling in `lib/ia/baseGenerator.ts`

---

## Phase 3: User Story 1 - Protection against automated abuse (Priority: P1) 🎯 MVP

**Goal**: Block requests exceeding 5 per minute per authenticated user and deny unauthenticated access.

**Independent Test**: Trigger 6 rapid requests from an authenticated user and verify the 6th returns 429; verify 401 for unauthenticated requests.

### Implementation for User Story 1

- [X] T005 [P] [US1] Update `lib/db.ts` to include `getAIRateLimit` and `incrementAIRateLimit` helper functions
- [X] T006 [US1] Implement the sliding window logic in `RateLimiter.checkLimit` (lib/ia/rateLimiter.ts)
- [X] T007 [US1] Finalize `BaseGenerator` integration to throw `RateLimitError` or `UnauthorizedError`

---

## Phase 4: User Story 2 - User notification and retry guidance (Priority: P2)

**Goal**: Provide clear feedback in the UI when rate limits are hit.

**Independent Test**: Hit the limit and verify the toast/alert message appears with the clarified text.

### Implementation for User Story 2

- [ ] T008 [US2] Update admin API routes to properly catch `RateLimitError` and return HTTP 429 in `app/api/admin/studio/requirements/generate/route.ts`
- [ ] T009 [US2] Update generic API error handling in the frontend to display the user-friendly rate limit message

---

## Phase 5: User Story 3 - Global AI Coverage (Priority: P1)

**Goal**: Ensure all AI endpoints (Evaluation, Feedback, etc.) are covered.

**Independent Test**: Verify 429 triggers on `POST /api/evaluation/analyze` and other AI endpoints.

### Implementation for User Story 3

- [ ] T010 [P] [US3] Review and update `app/api/evaluation/analyze/route.ts` to handle rate limit errors
- [ ] T011 [P] [US3] Review and update `app/api/analysis/rejection-feedback/route.ts` to handle rate limit errors

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T012 Security review of rate limiting bypasses (IP spoofing check)
- [ ] T013 Run `quickstart.md` validation scenarios
- [ ] T014 Cross-artifact consistency check

---

## Dependencies & Execution Order

1. **Setup (Phase 1)** & **Foundational (Phase 2)** MUST be completed first.
2. **User Story 1 (US1)** is the MVP and should be prioritized.
3. **User Story 2 (US2)** and **User Story 3 (US3)** can proceed after US1 completion.

## Parallel Execution Examples

- T001 and T002 can be implemented simultaneously.
- T010 and T011 can be updated in parallel after the core logic in T007 is stable.
