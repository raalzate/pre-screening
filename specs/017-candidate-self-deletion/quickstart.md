# Quickstart: Candidate Self-Deletion

This guide provides the necessary context and steps to implement the "Withdraw from Process" feature for candidates.

## Context
Candidates need a way to voluntarily exit the selection process. This involves:
1.  **UI**: Adding a withdrawal button in the candidate portal.
2.  **API**: A `POST` endpoint to move active records to history.
3.  **Audit**: Tracking the withdrawal event via a dashboard alert for administrators.

## Implementation Steps

### 1. Database Initialization
Update `lib/db.ts` to include the `admin_notifications` table.

### 2. API Implementation
- Create `app/api/user/withdraw/route.ts`:
  - Fetch active user data from `users`.
  - Move to `history_candidates` with `step = 'withdrawn'`.
  - Create an entry in `admin_notifications`.
  - Sign out the user (invalidate session).

### 3. Frontend Updates
- Modify `app/(protected)/page.tsx` to include the "Withdraw" button.
- Implement a confirmation modal using standard UI patterns.

### 4. Admin Dashboard
- Update `app/(public)/admin/page.tsx` to fetch and display notifications from `admin_notifications`.

## Verification
- **Manual**: Log in as a candidate, click "Withdraw", confirm, and verify the record moves to the history view in the admin panel.
- **API**: Test `POST /api/user/withdraw` to ensure 401 occurs if no session exists and 200 occurs for valid candidates.
