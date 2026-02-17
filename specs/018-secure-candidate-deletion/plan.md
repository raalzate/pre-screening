# Implementation Plan: Secure Candidate Deletion

**Branch**: `018-secure-candidate-deletion` | **Date**: 2026-02-17 | **Spec**: [spec.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/018-secure-candidate-deletion/spec.md)

## Summary

This feature enables administrators to permanently delete candidates from the system while ensuring they are notified of the reason. The implementation involves a secure API route that validates admin permissions, sends a professional email notification using existing branding, performs a permanent database deletion of PII, and logs the action for audit purposes.

### Proposed Changes

#### lib/db.ts
- Add `deleteCandidatePermanently(code, requirements)` helper.
- Update `createAdminNotification` to support `CANDIDATE_DELETED` type.

#### lib/email.ts
- Add `sendCandidateDeletionEmail(name, email, reason)` using `getSofkaTemplate`.

#### app/api/admin/candidates/delete/route.ts [NEW]
- Implement POST handler with session validation, email dispatch, and database deletion.

#### app/(protected)/admin/candidates/components/DeleteCandidateDialog.tsx [NEW]
- UI component for confirmation and reason selection.

#### app/(protected)/admin/page.tsx (or relevant candidate list page)
- Integrate the delete action into the candidate management UI.

## Verification Plan

### Automated Tests
- **API Unit Test**: Test `/api/admin/candidates/delete` with mocked session and database client.
- **Email Logic**: Verify `sendCandidateDeletionEmail` correctly populates the template with the provided reason.

### Manual Verification
1. **Login as Admin**: Ensure you have administrator privileges.
2. **Select Candidate**: Navigate to the candidate list and click the "Delete" action for a test candidate.
3. **Choose Reason**: Select a default reason (e.g., "Position closed") and confirm.
4. **Verify DB**: Check that the candidate record no longer exists in the `users` table.
5. **Verify Audit**: Check the `admin_notifications` table/UI for a record of the deletion.
6. **Verify Email**: Check terminal logs or mail sink for the dispatch of the notification email.
7. **Custom Reason Test**: Repeat with "Other" and ensure the custom text is correctly processed and sent.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: `@libsql/client` (Turso), `next-auth`, `nodemailer`, `genkit` (for potential email content)
**Storage**: Turso (LibSQL / SQLite)
**Testing**: `npm test`
**Target Platform**: Vercel / Next.js
**Project Type**: Web Application
**Performance Goals**: Candidate deletion and email dispatch within 2 seconds; <3 clicks for admin.
**Constraints**: Admin-only authorization; Data deletion must be permanent (PII removal).
**Scale/Scope**: Administrative tool for candidate management.

## Constitution Check

### Principles Alignment
- **Architecture First**: Spec and Plan created before implementation. ✅
- **Type Safety**: TypeScript with strict null checks to be used. ✅
- **AI-Driven**: Genkit to be used for personalized/professional email generation if applicable. ✅
- **Tessl Alignment**: All dependencies verified via `tessl.json`. ✅
- **Security**: Environment variables (SMTP/DB) accessed via `config.ts`. ✅

### Quality Gates
- **Linting**: Will run `npm run lint` before finishing.
- **Build**: Will ensure `npm run build` succeeds locally.
- **Documentation**: API route `/api/admin/candidates/delete` and UI components will be documented.

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

```text
app/
├── (protected)/
│   └── admin/
│       └── candidates/
│           └── components/
│               └── DeleteCandidateDialog.tsx
└── api/
    └── admin/
        └── candidates/
            └── delete/
                └── route.ts

lib/
├── db.ts               # Database helpers for candidate deletion
├── email.ts            # Email helpers (Nodemailer)
└── config.ts          # Configuration access
```

**Structure Decision**: Standard Next.js App Router structure. Admin-only components in `(protected)/admin` and API routes in `api/admin`. Logic extracted to `lib/` for testability.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
