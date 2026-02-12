# Feature Specification: Candidate Reminder System

**Feature Branch**: `016-candidate-reminder-system`  
**Created**: 2026-02-12  
**Status**: Draft  
**Input**: User description: "se busca tener en la parte administrativa un recordatorio (email) para que continúen en el proceso, resulta que los candidatos se están quedando en la parte de pre-screening, se busca tener un botón de recordatorio para que el candidato acceda a la plataforma y también se quiere otro botón para eliminar al candidato que ya ha recibido varios recordatorios"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manual Candidate Reminder (Priority: P1)

As an administrator, I want to send a reminder email to a candidate stuck in the 'pre-screening' phase so that they are encouraged to continue.

**Why this priority**: High. It directly addresses the problem of candidates stalling in the initial phase, improving the funnel conversion.

**Independent Test**: Can be tested by clicking a "Send Reminder" button on a candidate in the "pre-screening" stage and verifying that an email is received by the candidate's email address.

**Acceptance Scenarios**:

1. **Given** I am on the Admin Dashboard, **When** I see a candidate in the "pre-screening" stage, **Then** a "Send Reminder" button should be visible.
2. **Given** I click the "Send Reminder" button, **When** the action completes, **Then** an email should be sent to the candidate with a link to the platform and the candidate's reminder count should increment.

---

### User Story 2 - Candidate Deletion for Inactive Profiles (Priority: P2)

As an administrator, I want to delete candidates who have received multiple reminders and remain inactive so that I can keep the candidate list clean and focused on active leads.

**Why this priority**: Medium. It helps with administrative hygiene but doesn't directly drive conversion.

**Independent Test**: Can be tested by clicking a "Delete" button on a candidate profile and verifying that the record is removed from the database and UI.

**Acceptance Scenarios**:

1. **Given** I am on the Admin Dashboard, **When** I see a candidate who has received reminders, **Then** a "Delete Candidate" button should be available.
2. **Given** I click the "Delete Candidate" button, **When** I confirm the deletion, **Then** the candidate's data should be permanently removed from the system.

---

### User Story 3 - Reminder Visibility (Priority: P3)

As an administrator, I want to see how many reminders have been sent to a candidate so that I can decide whether to send another one or delete the profile.

**Why this priority**: Low. It provides context for the other two stories.

**Independent Test**: Can be tested by checking the candidate row in the admin list and verifying a "Reminders: N" field exists.

**Acceptance Scenarios**:

1. **Given** a candidate has received 2 reminders, **When** I view the candidate list, **Then** I should see "Reminders: 2" next to their name or in their details.

### Edge Cases

- **Duplicate Reminders**: Prevent sending a reminder if one was sent very recently (e.g., within the last 24 hours).
- **Invalid Email**: Handle cases where the candidate's email is malformed or bounce-backs (log error).
- **Admin Permissions**: Ensure only admins can trigger these actions (already handled by existing admin auth, but good to note).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Admin MUST be able to trigger a reminder email for any candidate in the "pre-screening" step.
- **FR-002**: The reminder email MUST contain a unique link for the candidate to access the platform.
- **FR-003**: System MUST track the number of reminders sent to each candidate.
- **FR-004**: Admin MUST be able to delete a candidate record from the dashboard once they have received at least 3 reminders without responding.
- **FR-005**: System SHOULD display the date of the last reminder sent to prevent over-communication.
- **FR-006**: Deletion MUST require a confirmation step to prevent accidental data loss.
- **FR-007**: The reminder email MUST follow a fixed, professional template with a one-click send action.

### Key Entities *(include if feature involves data)*

- **User**: Existing entity. Needs new fields:
    - `reminder_count`: Integer (default 0).
    - `last_reminder_at`: Datetime (nullable).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of reminder actions lead to a successful email dispatch (if email is valid).
- **SC-002**: Admin can trigger a reminder or deletion in less than 3 seconds (UI responsiveness).
- **SC-003**: Reminder count accurately increments after every successful send.
- **SC-004**: Implementation of these tools results in a reduction of "stalled" pre-screening candidates (long-term goal).
