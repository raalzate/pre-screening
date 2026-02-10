# Implementation Plan - Refine Feedback Flow & Fix Search

This plan addresses two key issues:
1.  Feedback should be scoped to a specific requirement and move that requirement context to history.
2.  Fix "User not found" error when searching/fetching candidates.

## User Review Required

> [!NOTE]
> Feedback will now require selecting a specific requirement if the candidate has multiple profiles assigned (e.g., "Fullstack, Backend").
> The system will effectively "split" the candidate record: the graded profile moves to History, while the ungraded ones remain in Active.

## Proposed Changes

### Frontend

#### [MODIFY] [page.tsx](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/app/(public)/admin/page.tsx)

- **Search Fix**: Ensure `code` is trimmed when setting `selectedCode` or calling `fetchCandidate` to avoid "User not found" errors due to whitespace.
- **Feedback UI (`InterviewFeedbackCard`)**:
  - Parse `userData.requirements` (split by comma).
  - Add a dropdown to select *which* requirement is being evaluated.
  - Pass the selected `requirement` to the feedback API.

### Backend

#### [MODIFY] [route.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/app/api/user/feedback/route.ts)

- **Input**: Accept `requirement` (string) in the body.
- **Logic**:
  1.  Fetch current user by `code`.
  2.  **Split & Move Logic**:
      - Let `currentReqs` = "A,B". Target = "A".
      - New `activeReqs` = "B".
      - **Transaction**:
        - `INSERT INTO history_candidates` (copy data, set `requirements="A"`, `moved_at=NOW`).
        - `UPDATE users SET requirements="B" WHERE code=?` (Update the active row).
      - **Edge Case: Single Requirement**:
        - If `currentReqs` == "A".
        - `INSERT INTO history_candidates`.
        - `DELETE FROM users`.

#### [MODIFY] [route.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/app/api/user/route.ts) (Search)

- Ensure `GET` endpoint handles `requirements` accurately.
- Add trim to `code` input.

## Verification Plan

### Manual Verification

1.  **Search**:
    -   Select a candidate who might have trailing spaces in their code (or just verify normal selection works).
    -   Confirm "Usuario no encontrado" does not appear.
2.  **Feedback Flow**:
    -   Create a candidate with 2 profiles (e.g., "React", "Node").
    -   Give feedback for "React" (Pass/Fail).
    -   **Verify**:
        -   Candidate remains in "Active" list implies "Node" profile?
        -   Actually, the row should update to show only "Node".
        -   "React" entry appears in "History".
    -   Give feedback for "Node".
    -   **Verify**:
        -   Candidate disappears from "Active".
        -   "Node" entry appears in "History".
