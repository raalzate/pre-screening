# API Contract: Candidate Self-Deletion

## Endpoints

### 1. Withdraw from Process
- **Path**: `POST /api/user/withdraw`
- **Authentication**: Required (Candidate session)
- **Description**: Moves all active profiles for the authenticated candidate to the history table and invalidates their session.
- **Request Body**:
  ```json
  {
    "reason": "optional string"
  }
  ```
- **Responses**:
    - `200 OK`: Withdrawal successful.
    - `401 Unauthorized`: No active session.
    - `500 Internal Server Error`: Database failure.

### 2. Get Notifications
- **Path**: `GET /api/admin/notifications`
- **Authentication**: Required (Admin session)
- **Description**: Returns a list of unread notifications for the admin.
- **Responses**:
    - `200 OK`: Returns `AdminNotification[]`.

### 3. Mark Notification as Read
- **Path**: `PUT /api/admin/notifications`
- **Authentication**: Required (Admin session)
- **Description**: Marks a specific notification as read.
- **Request Body**:
  ```json
  {
    "id": "number"
  }
  ```
- **Responses**:
    - `200 OK`: Success.
