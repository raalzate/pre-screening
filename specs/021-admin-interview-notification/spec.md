# Feature Specification: Admin Interview Notifications

**Feature Branch**: `021-admin-interview-notification`  
**Created**: 2026-02-17  
**Status**: Draft  
**Input**: User description: "cuando el candidato pasa a entrevista se debe registrar una notificacion al administrador"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Candidate Progression Alert (Priority: P1)

When a candidate successfully reaches the "Interview" stage (either by completing technical validation or by manual admin promotion), the system must register a notification for the administrators to ensure they are aware that a new interview needs to be scheduled or performed.

**Why this priority**: High. This ensures that candidates who reach the final stage of the process are not forgotten and that recruiters/admins can take action immediately.

**Independent Test**: Complete the technical certification phase with a passing score and verify that a new entry appears in the administrator's notification panel.

**Acceptance Scenarios**:

1. **Given** a candidate in the "Certified" stage, **When** they (or an admin) perform the action that moves them to "Interview", **Then** a notification record should be created in the system.
2. **Given** a new interview notification, **When** an administrator views their notification list, **Then** they should see the candidate's name and the fact they transitioned to the interview stage.

---

### User Story 2 - Multiple Candidate Notifications (Priority: P2)

The system must handle multiple candidates reaching the interview stage concurrently, ensuring each one generates a distinct and identifiable notification for the administrator.

**Why this priority**: Medium. Ensures reliability when multiple processes are running.

**Independent Test**: Simulating three candidates reaching the interview stage and verifying three unique notifications are recorded.

**Acceptance Scenarios**:

1. **Given** multiple active candidates, **When** each one progresses to the interview stage, **Then** the system must create one notification per candidate.

---

### Edge Cases

- **Re-notification**: If a candidate is moved back and then again to the interview stage, how many notifications are generated? (Default: Generate a new notification for each transition to ensure visibility).
- **Candidate Deletion**: If a candidate is deleted, what happens to their interview notifications? (Default: Keep notifications as historical records, but ensure they don't lead to dead links).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST create a record in the `admin_notifications` table whenever a candidate's `step` attribute changes to `interview`.
- **FR-002**: The notification MUST include the candidate's name and unique code.
- **FR-003**: The notification MUST include a clear message: "El candidato [Nombre] ha pasado a la etapa de entrevista".
- **FR-004**: The notification MUST be marked as unread (is_read = 0) by default.
- **FR-005**: The system MUST store the timestamp of when the notification was generated.

### Key Entities *(include if feature involves data)*

- **Admin Notification**: A record representing an alert for administrators, including type, message, and metadata about the candidate.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of candidate transitions to the "Interview" stage generate a corresponding notification record.
- **SC-002**: Notifications are registered in the database within 2 seconds of the status change.
- **SC-003**: The notification message correctly identifies the candidate in 100% of cases.
