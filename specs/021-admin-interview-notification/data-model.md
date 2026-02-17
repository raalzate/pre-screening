# Data Model: Admin Interview Notifications

This feature uses the existing `admin_notifications` table to store alerts.

## Entities

### Admin Notification
Represents an alert in the admin dashboard.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary Key, Autoincrement |
| type | TEXT | Type of notification (e.g., 'INTERVIEW_READY') |
| candidate_name | TEXT | Name of the candidate for reference |
| candidate_code | TEXT | Code of the candidate for reference |
| message | TEXT | Human-readable message |
| is_read | INTEGER | Binary toggle (0 = unread, 1 = read) |
| created_at | TEXT | Timestamp of creation (ISO8601) |

## State Transitions

1.  **Creation**: Triggered when `step` is set to `'interview'` in `users` table.
2.  **Consumption**: Admin views the notification in the dashboard.
3.  **Completion**: Admin marks the notification as read.
