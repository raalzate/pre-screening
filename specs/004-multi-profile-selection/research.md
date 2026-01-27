# Research: Multi-Profile Schema Strategy

## Problem
The `users` table currently defines `code` as the `PRIMARY KEY`. This prevents multiple records (profiles) from sharing the same access code. The requirement is to allow a single access code to map to multiple profiles (rows), which the candidate can then select from.

## Solution: Composite Primary Key

### Database Changes
1. **Remove PK from `code`**: The `code` column must no longer be unique across the table.
2. **New PK Strategy**: The combination of (`code`, `requirements`) should be unique. Alternatively, we can introduce a surrogate `id` column, but a composite key is more semantic for this use case.
3. **Migration Steps**:
   - Create a temporary table with the desired schema (Composite PK: `code`, `requirements`).
   - Copy data from `users` to `users_new`.
   - Drop `users`.
   - Rename `users_new` to `users`.

### Logic Changes
- **Candidate Lookup**: `SELECT * FROM users WHERE code = ?` will now return an array of rows instead of a single row.
- **Admin Grouping**: The admin UI must group these rows by `code` to present a unified "Candidate" view with multiple "Application" sub-views.

## Decisions

### Decision: Schema Migration
- **Approach**: Re-create the `users` table with `PRIMARY KEY (code, requirements)`.
- **Rationale**: This enforces that a candidate cannot have the exact same profile assigned twice under the same code, which avoids duplication errors.

### Decision: API Response
- **Endpoint**: `/api/user/verify`
- **Change**: If multiple rows are found for a code, return a status `409 Conflict` (or similar) with the list of available profiles, prompting the frontend to show the selection UI. OR return `200 OK` with a `profiles` array.
- **Selection**: Improve the design to return a standard structure. If >1 profile, the frontend handles the selection.

### Decision: Frontend Flow
- **Single Profile**: Auto-redirect to the form (legacy behavior).
- **Multi Profile**: Show a card for each profile. User clicks one -> App sets that specific `requirements` context for the session.
