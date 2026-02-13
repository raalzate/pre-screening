# Data Model: Candidate Self-Deletion

## Entities

### `User` (Internal Reference)
*Already exists in `users` table.*
- `code`: TEXT (Unique identifier for candidate)
- `requirements`: TEXT (Specific role/seniority)
- `step`: TEXT (Selection phase)
- `interview_status`: TEXT (Status of the candidate)

### `HistoryCandidate` (Internal Reference)
*Already exists in `history_candidates` table.*
- Matches `User` schema.
- `moved_at`: DATETIME (Timestamp of archival)

### `AdminNotification` (New)
*Stores alerts for the administrator dashboard.*
- `id`: INTEGER PK AUTOINCREMENT
- `type`: TEXT (Category of notification, e.g., 'withdrawal')
- `candidate_name`: TEXT (Name of the candidate)
- `candidate_code`: TEXT (Reference to user code)
- `message`: TEXT (Human readable alert)
- `is_read`: BOOLEAN (Default 0)
- `created_at`: TEXT (ISO timestamp)

## State Transitions

| Action | Source State | Target State | Side Effect |
|--------|--------------|--------------|-------------|
| Withdraw | Any (Active) | Withdrawn (in History) | Session invalidation, Admin notification created |
