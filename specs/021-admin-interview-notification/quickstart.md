# Quickstart: Admin Interview Notifications

## Registration Flow

1.  A candidate completes the technical evaluation.
2.  The system suggests moving to the interview stage.
3.  The `POST /api/challenge` endpoint is called.
4.  The candidate's `step` is updated to `'interview'`.
5.  **New Step**: A notification is created in the `admin_notifications` table.

## Verification

To verify the integration:
1.  Navigate the candidate flow until the challenge generation.
2.  Complete the challenge generation.
3.  Check the database or the admin dashboard (Notification segment) for the new alert.
