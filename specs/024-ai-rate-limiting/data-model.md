# Data Model: AI Rate Limiting

## Entities

### `ai_rate_limits`
Tracks request volume and window status for each authenticated user.

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | TEXT (PK) | Canonical identifier for the user (from NextAuth session). |
| `request_count` | INTEGER | Number of AI requests made in the current window. |
| `window_start` | TEXT | Timestamp (ISO 8601) when the current 60-second window began. |

## Rules

- **Uniqueness**: One entry per `user_id`.
- **Cleanup**: (Optional) In-memory or periodic cleanup of expired windows, though `INSERT OR REPLACE` logic in the DB is usually sufficient for stateless tracking.
- **Window Reset**: If `CURRENT_TIMESTAMP - window_start > 60s`, the `request_count` MUST be reset to 1 and `window_start` to `CURRENT_TIMESTAMP`.
