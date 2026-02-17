# Quickstart: Secure Candidate Deletion

## Development Setup

1. **Verify Environment Variables**: ensure `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` are set in `.env.local` for email notifications.
2. **Database Status**: Turso database is required. Tables `users` and `admin_notifications` must exist.
3. **Admin Access**: You must be logged in as an administrator to use the deletion feature.

## Implementation Steps (Phase 2 Preview)

1. **UI**: Add "Delete" button to the candidate list in the admin dashboard.
2. **Dialog**: Create a confirmation dialog with a dropdown for "Reason" and a text field for "Custom Reason".
3. **API**: Implement the `POST /api/admin/candidates/delete` route.
4. **Email**: Update `lib/email.ts` with `sendCandidateDeletionEmail`.

## Testing the API

```bash
curl -X POST http://localhost:3000/api/admin/candidates/delete \
  -H "Content-Type: application/json" \
  -d '{
    "candidateCode": "TEST-123",
    "requirements": "Senior Backend",
    "reason": "POSITION_FILLED"
  }'
```
*(Note: Requires valid admin session cookie)*
