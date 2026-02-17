# Research: Candidate Retry System

## Existing Infrastructure

- **Database**:
  - `users` table uses `(code, requirements)` as primary key.
  - Current schema lacks an attempt counter.
  - Suggestion: Add `retry_count INTEGER DEFAULT 0` to `users` and `history_candidates`.
- **UI (Dashboard)**:
  - `app/(protected)/page.tsx` renders different views based on `auth.user.step`.
  - The "feedback" view is shown when `auth.user.step === 'feedback'`.
  - Pre-screening status is determined by `evaluation_result` JSON string.
- **Evaluation Logic**:
  - Evaluation results are stored as a JSON string in `evaluation_result`.
  - To reset, we need to clear `evaluation_result`, `questions`, and `step`.

## Design Decisions

### 1. Data Mode Update
- Add `retry_count` column to `users` table via `initDb` migration.
- Increment this counter in the `/api/user/retry` endpoint.

### 2. API Endpoint
- **Path**: `POST /api/user/retry`
- **Logic**:
  - Verify auth (candidate).
  - Check `retry_count < 3`.
  - Update user: `retry_count += 1`, `evaluation_result = NULL`, `questions = NULL`, `step = 'pre-screening'`.
  - Return updated user state.

### 3. UI Integration
- **Component**: Create `RetryButton.tsx` in `components/evaluation/`.
- **Locations**:
  - In the "Pre-screening" completion/result view (internal to the evaluation flow).
  - In `app/(protected)/page.tsx` within the `feedback` step view.
- **Visuals**: Show "Reintentar (3 intentos restantes)" and decrement accordingly.

## Alternatives Considered

- **Resetting everything**: We only reset the pre-screening related fields. Other certifications/challenges are preserved if they were already reached (though a retry usually means they failed early anyway).
- **Infinite retries**: Rejected as per user requirement of 3 max.
