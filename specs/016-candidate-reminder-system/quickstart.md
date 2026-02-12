# Quickstart: Candidate Reminder System

## Backend Integration

### 1. Database Migration
Run the following SQL to update the schema:
```sql
ALTER TABLE users ADD COLUMN reminder_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN last_reminder_at DATETIME;
```

### 2. Email Template
Add a new reminder function to `lib/email.ts` using the standard header/footer.

### 3. API Endpoints
- `POST /api/admin/reminders`: Handles email dispatch and counter increment.
- `DELETE /api/admin/candidates/[code]`: Handles removal with guard logic.

## Frontend Integration

### 1. Admin Dashboard
- Locate the candidate list in `app/(public)/admin/page.tsx`.
- Update the columns to include "Reminders".
- Add buttons for "Reminder" (eye/bell icon) and "Delete" (trash icon).

## Verification Steps

1. **Test Environment**: Use a local `users.db`.
2. **API Check**:
   ```bash
   # Send reminder
   curl -X POST http://localhost:3000/api/admin/reminders -d '{"candidateCode": "TEST123"}'
   
   # Attempt delete (should fail if count < 3)
   curl -X DELETE http://localhost:3000/api/admin/candidates/TEST123
   ```
