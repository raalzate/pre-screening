# API Contract: Multi-Profile Support

## Endpoint: POST /api/user/verify

### Logic Update
Previously returned a single user object. Now returns a list of matching profiles if found, or a single object.

### Response (Single Profile - Backward Compatible)
```json
{
  "code": "CODE-123",
  "name": "Single User",
  "requirements": "profile-a",
  "step": "welcome",
  "form_id": "form-a"
}
```

### Response (Multi Profile - New)
```json
{
  "profiles": [
    {
      "code": "CODE-123",
      "requirements": "profile-a",
      "step": "welcome",
      "form_id": "form-a"
    },
    {
      "code": "CODE-123",
      "requirements": "profile-b",
      "step": "welcome",
      "form_id": "form-b"
    }
  ]
}
```

### Frontend Handling
- If response has `profiles` array: Show selection UI.
- If response has direct user object: Proceed to welcome screen.
