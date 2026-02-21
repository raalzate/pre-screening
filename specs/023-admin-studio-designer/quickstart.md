# Quickstart: Admin Studio Designer (023)

## Environment Setup
Ensure the following environment variables are set (standard for this project):
- `TURSO_DB_URL`
- `TURSO_DB_TOKEN`
- `GOOGLE_API_KEY` (for Gemini-2.0-flash)

## Database Initialization
The tables will be automatically created on application start via `lib/db.ts:initDb()`.
If you need to manually trigger it, you can run a script that calls `initDb()`.

## Core Workflows

### 1. Generating Requirements
1. Navigate to `/admin/studio/requirements/new`.
2. Enter the Job Role and Seniority.
3. Click "Generate Draft".
4. Review the skills and weights (1-5).
5. Click "Save to Studio".

### 2. Generating Evaluation Forms
1. Navigate to `/admin/studio/forms/new`.
2. Select an existing Requirement Profile.
3. Click "Generate Evaluation".
4. The AI will create categories and questions mapped to the selected skills.
5. Click "Register Form".

## Verification
- Use the Studio Dashboard (`/admin/studio`) to see your registered configurations.
- Verify that the `questions` and `requirements` fields in the DB contain the expected JSON structure.
