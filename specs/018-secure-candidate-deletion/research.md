# Research: Secure Candidate Deletion

## Deletion Strategy

- **Table**: `users`
- **Method**: Permanent deletion using `DELETE FROM users WHERE code = ? AND requirements = ?`.
- **History**: The project already has a `history_candidates` table used for "withdrawn" status. However, the requirement for this feature is "eliminar de la base de datos", which implies permanent removal of PII. We will proceed with `DELETE`.

## Notification Strategy

- **Library**: `nodemailer` (via `lib/email.ts`).
- **Template**: Will reuse `getSofkaTemplate` to maintain brand consistency ("SOFKA TEST").
- **Reasons**:
  - Position closed (Default)
  - Candidate withdrew
  - Requirements not met
  - Custom reason (input by admin)

## Security Patterns

- **Authentication**: `next-auth` is used.
- **Authorization**: Check `session.user.role === 'admin'`.
- **Route**: `app/api/admin/candidates/delete/route.ts`.

## Decisions & Rationale

| Decision | Rationale | Alternatives |
|----------|-----------|--------------|
| Permanent Deletion | Spec requires "eliminar de la base de datos" for data security/PII removal. | Soft delete (rejected due to explicit request for removal). |
| Reuse template | Consistency with existing candidate communication. | Plain text email (rejected for poor UX). |
| Composite Key | `users` table uses `(code, requirements)` as primary key. | Using only `code` (rejected, might collide across different requirements). |
