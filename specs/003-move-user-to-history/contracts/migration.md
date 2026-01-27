# API Contract: Feedback and Migration

## Endpoint: POST /api/user/feedback

### Logic Update
When this endpoint is called with final feedback, the system moves the user to history.

### Request Body
```json
{
  "code": "CANDIDATE-CODE",
  "feedback": "Detailed interview notes...",
  "status": "pasa | no_pasa | en_espera",
  "technicalLevel": "Junior | Ssr | Senior"
}
```

### Migration Sequence (Transaction)
1. **Validation**: Ensure the candidate exists in `users`.
2. **Move**: 
   ```sql
   INSERT INTO history_candidates (
     name, email, code, requirements, step, form_id, 
     evaluation_result, questions, certification_result, 
     challenge_result, interview_feedback, interview_status, 
     technical_level, interviewer_name, moved_at
   )
   SELECT 
     name, email, code, requirements, 'archived', form_id, 
     evaluation_result, questions, certification_result, 
     challenge_result, ?, ?, ?, ?, datetime('now')
   FROM users WHERE code = ?;
   ```
3. **Purge**:
   ```sql
   DELETE FROM users WHERE code = ?;
   ```

### Responses
- **200 OK**: { "message": "Feedback guardado y candidato archivado" }
- **401 Unauthorized**: Admin session required.
- **400 Bad Request**: Missing mandatory fields.
- **500 Error**: Transaction rolled back, data preserved in active users.
