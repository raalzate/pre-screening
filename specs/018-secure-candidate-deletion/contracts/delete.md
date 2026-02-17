# API Contract: Candidate Deletion

## POST /api/admin/candidates/delete

Deletes a candidate permanently and notifies them via email.

### Authorization
- **Role**: `admin`
- **Method**: Session-based (`next-auth`)

### Request Body

```json
{
  "candidateCode": "string",
  "requirements": "string",
  "reason": "POSITION_FILLED | CANDIDATE_WITHDREW | REQUIREMENTS_NOT_MET | CUSTOM",
  "customReason": "string" (optional, required if reason is CUSTOM)
}
```

### Response

- **200 OK**: Deletion successful.
  ```json
  {
    "success": true,
    "message": "Candidato eliminado y notificado exitosamente."
  }
  ```
- **401 Unauthorized**: No active session.
- **403 Forbidden**: User is not an admin.
- **400 Bad Request**: Missing fields or invalid reason.
- **500 Internal Server Error**: Database or Email service failure.

### Behavior
1. Validates admin session.
2. Validates request body.
3. Fetches candidate details (name, email) from `users`.
4. Sends email notification using `lib/email.ts`.
5. Deletes row from `users`.
6. Creates an entry in `admin_notifications` for audit trail.
