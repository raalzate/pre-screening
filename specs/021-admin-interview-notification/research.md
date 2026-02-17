# Research: Admin Interview Notifications

This document consolidates findings regarding candidate status transitions to the "Interview" stage and the existing notification infrastructure.

## Decision: Integration via challenge API

I have identified that the primary (and currently only) automated way a candidate reaches the "Interview" stage is upon successful generation of a challenge through the `app/api/challenge/route.ts` endpoint.

### Findings

1.  **Status Transition**: The code in `app/api/challenge/route.ts` explicitly sets the `step` to `'interview'` after generating the challenge content.
2.  **Notification Schema**: The `admin_notifications` table already exists with the following structure:
    -   `type`: TEXT (e.g., 'INTERVIEW_READY' or similar)
    -   `candidate_name`: TEXT
    -   `candidate_code`: TEXT
    -   `message`: TEXT
    -   `is_read`: INTEGER
3.  **Existing Helpers**: `lib/db.ts` contains `createAdminNotification`, which simplifies the insertion of new alerts.

### Proposed Hook Point

The best place to trigger the notification is within the `POST` handler of `app/api/challenge/route.ts`, immediately after the database update that sets the candidate's step to "interview".

## Alternatives Considered

- **Global DB Trigger**: Rejected as it adds external complexity to the database layer which is not standard in this project.
- **Middleware**: Rejected as status changes are infrequent and localized to specific API routes.
- **Frontend Trigger**: Rejected because notifications should be reliable and registered on the server side even if the client disconnects.

## Unknowns Resolved

- **Manual Admin Updates**: The admin UI current lists candidates by step but doesn't seem to have a manual "Move to Interview" button that bypasses the challenge generation. If such a feature is added later, it should also include the notification hook.
