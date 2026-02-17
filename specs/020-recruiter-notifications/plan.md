# Plan: Recruiter Notifications

This feature enables automatic notifications to recruiters when a candidate they created is rejected by the system or initiates a retry. It involves capturing the creator's identity during candidate creation and hooking into the evaluation and retry flows.

## User Review Required

> [!IMPORTANT]
> A new environment variable `DEFAULT_RECRUITER_EMAIL` (defaulting to `raul.alzate@sofka.com.co`) is used to notify about candidates created before this feature was implemented.

## Proposed Changes

### Database Layer
#### [MODIFY] [db.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/lib/db.ts)
- Add `created_by` column (TEXT NULL) to `users` and `history_candidates` tables.
- Update `withdrawCandidate` and `restoreCandidate` to preserve the `created_by` value.

### Configuration Layer
#### [MODIFY] [config.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/lib/config.ts)
- Add `DEFAULT_RECRUITER_EMAIL` with default `raul.alzate@sofka.com.co`.

### API Layer
#### [MODIFY] [api/user/route.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/app/api/user/route.ts)
- Update `POST` to capture the admin's email and save it in the `created_by` column.

#### [MODIFY] [api/evaluation/route.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/app/api/evaluation/route.ts)
- Trigger recruiter notification on rejection.

#### [MODIFY] [api/user/retry/route.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/app/api/user/retry/route.ts)
- Trigger recruiter notification on retry.

### Email Layer
#### [MODIFY] [email.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/lib/email.ts)
- Implement `sendRecruiterNotification`.

## Verification Plan

### Automated Tests
- `npm run lint`

### Manual Verification
1. Create candidate -> check `created_by` in DB.
2. Fail evaluation -> check recruiter email.
3. Retry evaluation -> check recruiter email.
