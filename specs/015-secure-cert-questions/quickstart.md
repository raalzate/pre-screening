# Quickstart: Secure Certification

## Development Setup

1. **Backend Changes**:
   - Update `GET /api/certification` to strip `correctAnswer` and `rationale` fields.
   - Implement `calculateResult` utility to validate answers on the server.
   - Update `POST /api/certification` to perform server-side validation.

2. **Frontend Changes**:
   - Modify `DynamicMCQForm` to stop calculating the score locally.
   - Update the submission flow to wait for the API response which now contains the score and details.

## Verification

### Automated Check (CLI/Script)
Run a script to fetch questions and verify no correct answers are present:
```bash
# Example check
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/api/certification | grep -E "correctAnswer|rationale"
```

### Manual Verification
1. Start the certification flow.
2. Open Network tab in Developer Tools.
3. Inspect the response from `/api/certification`.
4. Verify `correctAnswer` and `rationale` are missing.
5. Complete the certification and verify results are displayed correctly after submission.
