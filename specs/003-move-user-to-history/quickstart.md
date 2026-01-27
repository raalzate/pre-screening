# Quickstart: Viewing Archived Candidates

## Overview
This feature automatically moves candidates from the active workboard to a history table once feedback is saved. This keeps the main dashboard clean and performant.

## How it works
1. Admin opens a candidate profile in the admin portal.
2. Under "Entrevista & Feedback", the admin fills in the evaluation and clicks **"Guardar Feedback"**.
3. The system executes a database transaction:
   - Inserts the full candidate row into `history_candidates`.
   - Sets the `moved_at` timestamp.
   - Deletes the row from the `users` table.

## Accessing Historical Data
> [!NOTE]
> Currently, historical data is stored in the database but not yet exposed in the Admin UI. To view archived records, use a database client (e.g., Turso CLI or Drizzle Studio):

```sql
SELECT * FROM history_candidates ORDER BY moved_at DESC;
```

## Troubleshooting
If a feedback submission fails, the candidate will remain in the `users` table with the process step "interview" until a successful submission occurs. No data loss is possible due to the atomic transactional design.
