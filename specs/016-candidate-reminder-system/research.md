# Research: Candidate Reminder System

## Decision 1: Email Integration Path
- **Decision**: Add `sendCandidateReminderEmail` to `lib/email.ts` using the existing `nodemailer` transporter.
- **Rationale**: Reuses the established `getSofkaTemplate` for branding consistency and avoids introducing new dependencies.
- **Alternatives considered**: Using `Resend` (suggested in `configSchema` but not active in `email.ts`). Rejected to keep implementation simple and consistent with other notifications.

## Decision 2: Database Schema Updates
- **Decision**: Add `reminder_count` (INTEGER, default 0) and `last_reminder_at` (DATETIME) to the `users` table.
- **Rationale**: Necessary for tracking state as per specification requirements.
- **Alternatives considered**: A separate `reminders` table. Rejected as overkill for a simple counter and timestamp within the existing user-centric model.

## Decision 3: Deletion Policy
- **Decision**: Hardware deletion via `DELETE` SQL statement, but only exposed to Admin if `reminder_count >= 3`.
- **Rationale**: Matches the user's specific request for cleaning up stalled candidates while providing a safety threshold.
- **Alternatives considered**: Soft delete (flagging). Rejected to strictly follow the "eliminar" requirement for database hygiene.
