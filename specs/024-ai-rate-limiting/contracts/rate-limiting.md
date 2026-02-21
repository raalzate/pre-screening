# API Contracts: AI Rate Limiting

The rate limiting is a **cross-cutting concern** enforced via middleware/service logic. It affects all existing AI endpoints by potentially returning an error response instead of the successful generation.

## Affected Endpoints

All endpoints following these patterns are covered:
- `POST /api/admin/studio/requirements/generate`
- `POST /api/admin/studio/forms/generate`
- `POST /api/evaluation/analyze`
- `POST /api/analysis/rejection-feedback`
- (And any other endpoint using a `BaseGenerator` subclass)

## Rate Limit Response

When a user exceeds 5 requests per minute, the following response MUST be returned:

**Status Code**: `429 Too Many Requests`

**Body**:
```json
{
  "error": "Has superado el límite de peticiones de IA. Por favor, espera un minuto antes de reintentar.",
  "retryAfter": 60
}
```

## Authentication Response

When a user is unauthenticated:

**Status Code**: `401 Unauthorized`

**Body**:
```json
{
  "error": "Autenticación requerida para usar funciones de IA."
}
```
