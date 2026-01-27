# Data Model: Multi-Profile Candidates

## Schema Changes

The `users` table will be modified to support multiple profiles per candidate code.

### Table: `users`
- **PK Strategy**: Composite Primary Key (`code`, `requirements`).
- **Removed**: Unique constraint on `code`.

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| name | TEXT | NOT NULL | Candidate Name |
| email | TEXT | NULL | Candidate Email |
| code | TEXT | NOT NULL | Access Code (Shared across profiles) |
| requirements | TEXT | NOT NULL | Profile Identifier (Unique per user code) |
| step | TEXT | NOT NULL | Current status of *this* profile application |
| form_id | TEXT | NOT NULL | Associated form template ID |
| evaluation_result | TEXT | NULL | Results for this specific profile |
| ... | ... | ... | Other fields remain per-profile |

### Table: `history_candidates`
- **PK Strategy**: Composite Primary Key (`code`, `requirements`, `moved_at`).
- **Rationale**: A candidate might apply for profile A, finish it, then apply for profile B later. Both records need to exist in history.

## Relationships
- One `code` (Candidate identity) -> Many `users` rows (Active applications).
- One `code` -> Many `history_candidates` rows (Completed applications).
