# Research: Candidate Self-Deletion

## Decision: Implementation Pattern
- **Logic Location**: A new API route `POST /api/user/withdraw`.
- **Database Action**: 
    - Use `db.batch` to ensure atomicity.
    - Insert current user records (for all requirements) into `history_candidates`.
    - Set `interview_status = 'withdrawn'` and `step = 'feedback'` (or just keep it as is but moved).
    - Delete records from `users`.
- **Notification**: Create a new table `admin_notifications` to store events.

## Rationale
- Soft deletion is required for auditing [FR-003].
- Dashboard alerts [FR-005] require a persistent store to ensure admins see them even if they are not online during the withdrawal.

## Alternatives Considered
- **Direct Email**: Rejected because the user specifically agreed to Dashboard alerts (Option B).
- **Flag on History Table**: Admin wouldn't be "alerted" prominently, they would have to search history. A notifications table allows for a badge/list in the header.

## Data Model Extensions
### Table: `admin_notifications`
- `id`: INTEGER PK
- `type`: TEXT (e.g., 'WITHDRAWAL')
- `message`: TEXT
- `candidate_code`: TEXT
- `created_at`: DATETIME
- `is_read`: BOOLEAN (DEFAULT 0)
