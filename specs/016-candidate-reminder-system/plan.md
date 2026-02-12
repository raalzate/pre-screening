## Summary

Implement a manual reminder and deletion system for candidates stalled in the 'pre-screening' phase. A new "Send Reminder" button will trigger a professional email via `nodemailer` and increment a `reminder_count` in the database. Deletion will be permitted for profiles that have received at least 3 reminders.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript / Next.js 15 (App Router)  
**Primary Dependencies**: `@libsql/client` (Turso), `next-auth`, `nodemailer`  
**Storage**: Turso (LibSQL / SQLite)  
**Testing**: Manual verification, Playwright  
**Project Type**: Web application  
**Performance Goals**: API response time < 200ms for admin actions  
**Constraints**: Reminders for 'pre-screening' only; Delete after 3 reminders  
**Scale/Scope**: ~1k candidates, administrative dashboard extension

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Architecture First**: ✓ Feature defined in `spec.md` and `plan.md`.
- **Type Safety**: ✓ Will use TypeScript for all new API routes and components.
- **AI-Driven**: N/A (Feature uses fixed email templates).
- **Tessl Alignment**: ✓ Dependencies will be checked against `tessl.json`.
- **Security**: ✓ Will move SMTP environment variables to `config.ts` and `configSchema`.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

- `lib/db.ts`: Existing database client.
- `lib/email.ts`: Will add `sendCandidateReminderEmail`.
- `app/api/admin/reminders/route.ts`: New endpoint for sending reminders.
- `app/api/admin/candidates/[id]/route.ts`: Update/Add endpoint for candidate management (deletion).
- `app/(public)/admin/page.tsx`: Update the main admin dashboard to show reminder stats and buttons.

**Structure Decision**: Option 1 (Single Project) - Standard Next.js App Router structure.

## Verification Plan

### Automated Tests
- **Endpoint Test**: Create a script `scripts/test-reminder-api.sh` to verify:
    - POST `/api/admin/reminders` increments count.
    - DELETE `/api/admin/candidates/[id]` only works if `reminder_count >= 3`.

### Manual Verification
1.  **Preparation**: Create a dummy candidate in `pre-screening` stage using SQL.
2.  **Dashboard**: Navigate to `/admin` and find the candidate.
3.  **Reminder**: Click "Send Reminder" button. Verify notification success and count display.
4.  **Deletion**:
    - Verify "Delete" button is disabled/hidden if count < 3.
    - Click "Send Reminder" until count reaches 3.
    - Verify "Delete" button becomes active.
    - Click "Delete", confirm modal, and verify candidate is gone from UI.
