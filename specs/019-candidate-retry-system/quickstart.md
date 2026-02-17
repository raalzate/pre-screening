# Quickstart: Testing Candidate Retry System

## Manual Verification Steps

1. **Setup Candidate**: Create a new candidate or use an existing one via the admin panel.
2. **Fail Pre-screening**: Log in as the candidate and intentionally fail the pre-screening questions.
3. **Verify Button Visibility**: 
   - Check the results page for the "Reintentar Evaluación (3 intentos restantes)" button.
   - Go to the home dashboard and verify the same button is visible in the feedback section.
4. **Trigger Retry**: Click the button and confirm.
5. **Verify Reset**: Ensure you are back at the first question and previous answers are cleared.
6. **Limit Test**: Repeat the process 3 times. Verify the button disappears or is disabled on the 4th attempt.

## Automated Checks (Post-Implementation)

- Run `npm test` to ensure existing flows are not broken.
- Verify `retry_count` increment in the database via `sqlite3` or similar.
