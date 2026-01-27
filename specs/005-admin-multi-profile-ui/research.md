# Research: Admin Multi-Profile UI

## Problem
Currently, the Admin dashboard lists candidates row-by-row. With the new composite key (`code, requirements`), a single person appears multiple times if they have assignments for both "Frontend" and "Backend". We need to deduplicate this view.

## Solution

### UX: Candidate Grouping
**Decision**: Group by `code` in the primary sidebar/list.
**Rationale**: The `code` is the unique identifier for the human candidate.
**Implementation**:
- Fetch all users `SELECT * FROM users`.
- Client-side grouping: `Map<Code, User[]>` or `Object.groupBy`.
- Display logic: Render 1 item per unique code. Code is the primary key for the view.

### UX: Selection Logic
**Decision**: When a grouped candidate is selected, show a "Summary" view that lists all their active profiles/applications as sub-tabs or cards.
**Rationale**: Reuse the existing `AdminFormsView` or candidate detail view, but wrapped in a parent container that handles the switching between profiles.

### UX: Form Multi-Select
**Decision**: Use a Checkbox Group for `requirements` in the "Unique Form".
**Rationale**: Simple and effective for a small number of profiles (currently <10). A complex multi-select dropdown is overkill.
**Submisison Logic**:
- Frontend loops through selected requirements.
- Sends 1 request per requirement to `POST /api/user`.
- Reason: The API `ON CONFLICT` logic is row-based. Bulk insert would require API refactoring. Looping is simpler for MVP and low volume (admin usage).

## API Constraints
- `POST /api/user` accepts a single object.
- **Verification**: Can we submit an array?
- **Finding**: Refactoring to array is cleaner but looping `fetch` promises is faster to implement without breaking existing types.
- **Choice**: Loop in frontend `Modal` component. `Promise.all([ ... ])`.

## Compatibility
- Existing "Single Profile" logic remains valid (array of length 1).
