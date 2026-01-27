# Data Model: Candidate History

## Entities

### ArchivedCandidate
Represents a candidate who has completed the pre-screening flow and whose data has been moved to history.

| Field | Type | Description |
|-------|------|-------------|
| name | TEXT | Full name of the candidate |
| email | TEXT | Email address (can be null) |
| code | TEXT | Primary Key. Unique identification code. |
| requirements | TEXT | Role requirements identifier |
| step | TEXT | Enrollment step (should be 'archived' or 'feedback') |
| form_id | TEXT | ID of the pre-screening form used |
| evaluation_result | TEXT | JSON string of the pre-screening results |
| questions | TEXT | JSON string of the questions asked |
| certification_result | TEXT | JSON string of the certification phase outcomes |
| challenge_result | TEXT | JSON string of the technical challenge outcomes |
| interview_feedback | TEXT | Final feedback provided by the interviewer |
| interview_status | TEXT | Pass/Fail status |
| technical_level | TEXT | Assigned technical grade (e.g., Senior) |
| interviewer_name | TEXT | Name of the person who conducted the final review |
| moved_at | TIMESTAMP | Date and time when the record was archived |

## State Transitions
- **Active User** (Table: `users`) → [Admin Submits Feedback] → **Archived Candidate** (Table: `history_candidates`)
