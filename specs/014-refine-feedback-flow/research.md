# Research: Refine Feedback Flow & Fix Search

**Feature**: `014-refine-feedback-flow`
**Status**: Complete

## Technical Context

- **Database**: `users` table uses a composite Primary Key `(code, requirements)`.
- **Requirements**: Stored as a comma-separated string (CSV) in the `requirements` column (e.g., "ReqA,ReqB").
- **Search Logic**: `GET /api/user` searches by `code` (and optionally `requirements`).
- **Use Candidate**: The `fetchCandidate` hook calls the API.
- **Problem 1 (Feedback)**: Feedback is currently applied to the entire candidate row. If a candidate has multiple requirements ("A,B"), giving feedback moves the whole row (or updates status for both). User wants to move *only* the specific requirement to history.
- **Problem 2 (Search)**: User reports "Usuario no encontrado". This message comes from the API when `rows.length === 0`. Likely caused by whitespace mismatches in `code` (e.g. "123 " vs "123").

## Decisions

### 1. Split Requirements on Feedback

- **Decision**: When providing feedback, if the user has multiple requirements, split them.
- **Logic**:
  - If user has "A,B" and feedback is for "A":
  - **Update** `users` table: set `requirements` = "B".
  - **Insert** into `history_candidates` table: set `requirements` = "A" (with feedback).
- **Rationale**: Keeps the "active" candidate in the list for the remaining requirement ("B") while moving the completed one ("A") to history.

### 2. Requirement Selector in UI

- **Decision**: Add a dropdown in `InterviewFeedbackCard` to select the specific requirement being evaluated if multiple exist.
- **Rationale**: The interviewer needs to specify which context applies.

### 3. Trim Code Input

- **Decision**: Trim the `code` input in the frontend before searching or fetching.
- **Rationale**: Prevents "User not found" errors due to accidental trailing spaces.

## Alternatives Considered

- **Split on Creation**: Create separate rows for "A" and "B" initially.
  - *Pros*: Simpler feedback logic.
  - *Cons*: Might break existing "Multi-profile" logic in dashboard if it expects grouped rows. The dashboard currently groups by code anyway (`groupCandidatesByCode`).
  - *Decision*: Stick to splitting on feedback for now to minimize migration impact, but consider splitting on creation for future refactors.

## Unknowns & Clarifications

- **Existing Data**: How to handle existing "A,B" rows? The proposed logic handles them gracefully by splitting at the moment of feedback.
