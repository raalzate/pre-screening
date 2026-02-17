# API Contracts: Admin Interview Notifications

This feature is integrated into the existing candidate progression endpoint.

## [POST] /api/challenge

Sets the candidate to the interview stage and triggers an admin notification.

### Response

```json
{
  "challenge": {
    "title": "...",
    "description": "...",
    "tasks": [...]
  }
}
```

### Side Effect (Notification)

Registers a new entry in `admin_notifications`:
- `type`: "INTERVIEW_READY"
- `message`: "El candidato [Nombre] ha pasado a la etapa de entrevista"
