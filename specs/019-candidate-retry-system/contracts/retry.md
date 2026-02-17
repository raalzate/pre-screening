# API Contract: Candidate Retry System

## POST `/api/user/retry`

Reset the candidate's pre-screening status to allow a re-attempt.

### Request
- **Headers**: 
  - `Content-Type: application/json`
  - Auth: Cookie (NextAuth session)
- **Body**: (Empty or optional requirement identifier if ambiguous)

### Response

#### Success (200 OK)
- **Body**:
```json
{
  "message": "Evaluación reiniciada correctamente",
  "retry_count": 1,
  "next_step": "pre-screening"
}
```

#### Forbidden (403 Forbidden)
- **Body**:
```json
{
  "message": "Has alcanzado el límite máximo de reintentos (3)"
}
```

#### Unauthorized (401 Unauthorized)
- **Body**:
```json
{
  "message": "No autorizado"
}
```
