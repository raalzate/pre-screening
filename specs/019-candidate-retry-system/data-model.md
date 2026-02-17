# Data Model: Candidate Retry System

## Table: `users` (and `history_candidates`)

Added tracking for re-evaluation attempts.

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `retry_count` | INTEGER | Number of re-attempts initiated by the candidate. | 0 |

### Validation Rules
- `retry_count` MUST be within [0, 3].
- A reset action is only permitted if `retry_count < 3`.

### State Transitions

```mermaid
state_boundary
  [*] --> pre_screening: Initial Login
  pre_screening --> feedback: Rejected
  feedback --> pre_screening: Retry (retry_count++)
  pre_screening --> certified: Passed
  feedback --> [*]: Max Attempts (3) Reached
```
