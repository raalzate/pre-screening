# Data Model: Secure Candidate Deletion

## Entities

### Candidate (External Reference)
- Represents a row in the `users` table.
- **Keys**: `code` (string), `requirements` (string).
- **Attributes used for notification**: `name`, `email`.

### DeletionReason (Enum)
Represents the reason for deleting a candidate.
- `POSITION_FILLED`: "Vacante ocupada"
- `CANDIDATE_WITHDREW`: "El candidato se retiró"
- `REQUIREMENTS_NOT_MET`: "No cumple con los requisitos"
- `CUSTOM`: Any other reason provided via text input.

### AuditLog / AdminNotification
Existing `admin_notifications` table in `lib/db.ts` will be used to track the deletion event for compliance.

```sql
INSERT INTO admin_notifications (type, candidate_name, candidate_code, message)
VALUES ('CANDIDATE_DELETED', ?, ?, ?)
```

## Validation Rules

1. **Required Fields**: `candidateCode`, `requirements`, `reason`.
2. **Custom Reason**: If the reason selected is `CUSTOM`, a non-empty `customReason` string must be provided.
3. **Authorization**: Deletion is only allowed if `session.user.role === 'admin'`.
