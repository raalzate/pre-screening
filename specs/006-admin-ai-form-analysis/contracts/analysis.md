# API Contract: Admin AI Form Analysis

## POST /api/admin/forms/analysis

Generates an AI-driven technical analysis for a given set of form results.

### Request Body

```json
{
  "formId": "string",
  "title": "string",
  "answers": {
    "question-id-1": 5,
    "question-id-2": 2
  },
  "resultData": {
    "score": 10,
    "totalPossible": 20,
    "percentage": 50,
    "improvements": [
      {
        "id": "q1",
        "question": "...",
        "score": 1,
        "example": "..."
      }
    ]
  }
}
```

### Response

**Success (200 OK)**

```json
{
  "analysis": "Markdown formatted analysis string..."
}
```

**Unauthorized (401)**
- Missing or invalid session.

**Bad Request (400)**
- Missing required fields in the request body.

**Server Error (500)**
- AI generation failed or internal server error.
