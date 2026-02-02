# Quickstart: Historical AI Form Analysis Results

## Local Setup
1. Ensure your Turso database is configured in `.env.local`.
2. Run `npm install` to ensure all dependencies are present.
3. The database migration will run automatically on the first request through `lib/db.ts` (once implemented).

## Manual Verification
1. Log in as an administrator.
2. Navigate to "Formularios".
3. Select a form (e.g., "React Technical assessment").
4. Fill out the form and click "Ver mis resultados".
5. Click "Analizar con IA".
6. Refresh the page or go back and click "Ver Reportes" (a new button in the card).
7. Verify the analysis you just generated is listed in the history.
8. Click on the history entry to view the full report.

## Automated Testing
- Use `npm test` to run unit tests for the logic (once added).
- Check the `/api/admin/forms/history/[id]` endpoint manually using a tool like Postman or `curl`.
