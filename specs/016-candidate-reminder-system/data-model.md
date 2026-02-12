# Data Model: Candidate Reminder System

## Entities

### User (Extended)
Existing entity in the `users` table.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `reminder_count` | INTEGER | 0 | Total number of manual reminders sent by admin. |
| `last_reminder_at` | DATETIME | NULL | Timestamp of the most recent reminder. |

## State Transitions

### Reminder Flow
1. **Initial State**: `reminder_count = 0`, `last_reminder_at = NULL`.
2. **Action**: Admin clicks "Send Reminder".
3. **End State**: `reminder_count += 1`, `last_reminder_at = CURRENT_TIMESTAMP`.

### Deletion Flow
1. **Condition**: `reminder_count >= 3` AND `step = 'pre-screening'`.
2. **Action**: Admin clicks "Delete".
3. **End State**: Record removed from `users` table.
