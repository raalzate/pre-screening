# Implementation Plan: Candidate Retry System

**Branch**: `019-candidate-retry-system` | **Date**: 2026-02-17 | **Spec**: [spec.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/019-candidate-retry-system/spec.md)
**Input**: Feature specification from `/specs/019-candidate-retry-system/spec.md`

## Summary

The goal is to implement a retry mechanism for candidates who fail the pre-screening phase. This involves tracking the number of re-attempts in the database (limited to 3), clearing previous evaluation data upon retry, and updating the UI to display a "Reintentar" button with an attempt counter on both the result page and the candidate home dashboard.

## Technical Context

**Language/Version**: TypeScript / Next.js 15 (App Router)  
**Primary Dependencies**: `@libsql/client` (Turso), `zod`, `next-auth`  
**Storage**: Turso (SQLite/libsql)  
**Testing**: `npm test` + manual verification via browser  
**Target Platform**: Web (Vercel)
**Project Type**: Web Application  
**Performance Goals**: Instant form reset (<1s)  
**Constraints**: Maximum 3 re-attempts per requirement profile.  
**Scale/Scope**: Impacts the candidate facing pre-screening flow and the dashboard.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Justification |
|------|--------|---------------|
| Architecture First | PASS | spec.md and plan.md created before implementation. |
| Type Safety | PASS | Using TypeScript for all new logic and API routes. |
| AI-Driven | N/A | This feature is rule-based, but uses the existing evaluation infrastructure. |
| Tessl Alignment | PASS | No new external dependencies required. |
| Security | PASS | Admin roles and candidate codes verify access to retry actions. |

## Project Structure

## Proposed Changes

### [Database]
- **[MODIFY] [lib/db.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/lib/db.ts)**:
  - Add `retry_count` (INTEGER DEFAULT 0) to `optionalColumns` in `initDb`.
  - Ensure `retry_count` is included in `history_candidates` table as well.

### [API]
- **[NEW] [app/api/user/retry/route.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/app/api/user/retry/route.ts)**:
  - Implement a `POST` handler that:
    1. Authenticates the candidate session.
    2. Checks if `retry_count < 3`.
    3. Resets `evaluation_result`, `questions`, `interview_status`, `interview_feedback` to `NULL`.
    4. Sets `step` to `pre-screening`.
    5. Increments `retry_count`.
    6. Returns the updated user object.

### [UI Components]
- **[NEW] [components/evaluation/RetryButton.tsx](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/components/evaluation/RetryButton.tsx)**:
  - Component to display the "Reintentar" button.
  - Receives `retryCount` as a prop.
  - Handles the API call and shows a loading state.
  - After success, it should either refresh the state or redirect home.

- **[MODIFY] [components/DynamicForm.tsx](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/components/DynamicForm.tsx)**:
  - Import and render `RetryButton` within the `!result.valid` view.

- **[MODIFY] [app/(protected)/page.tsx](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/app/(protected)/page.tsx)**:
  - Import and render `RetryButton` within the `feedback` step view if the candidate was rejected.

## Verification Plan

### Automated Tests
- No existing automated tests for this flow. Verification will be focused on manual testing through the UI.

### Manual Verification
1. **Reset Flow**:
   - Log in with code `TEST-CANDIDATE`.
   - Complete pre-screening with answers that result in rejection.
   - Verify the "Reintentar (3 intentos restantes)" button appears.
   - Click the button and confirm.
   - Verify that the form resets and you can answer again.
2. **Limit Enforcement**:
   - Perform the retry flow 3 times.
   - Verify that after the 3rd retry (4th attempt total), the button no longer appears.
3. **Dashboard Visibility**:
   - After being rejected, go to the "home" dashboard (feedback view).
   - Verify the "Reintentar" button is visible there as well.
4. **Data Persistence**:
   - Verify in the database that `retry_count` incremented correctly for each attempt.

## Complexity Tracking

> No violations of the constitution detected.
