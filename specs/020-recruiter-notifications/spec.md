# Feature Specification: Recruiter Notifications on Rejection & Retry

**Feature Branch**: `020-recruiter-notifications`  
**Created**: 2026-02-17  
**Status**: Draft  
**Input**: User description: "se requiere obtener el correo del la persona que creo el candidato para notificarle cuando el candidato fue rechazado por el sistema y por cada reintento que tiene, esto es con el fin de que luego el reclutador se de cuenta de que no debe agendar cita"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Capture Recruiter Identity (Priority: P1)

When an administrator creates a new candidate profile, the system must automatically record the administrator's email associated with that candidate.

**Why this priority**: High. This is the foundational data required for any notification logic.

**Independent Test**: Create a candidate as an admin and verify in the database that the `created_by` field is populated with the admin's email.

**Acceptance Scenarios**:

1. **Given** an authenticated administrator, **When** they create a new candidate, **Then** the candidate record should store the admin's email in a `created_by` field.
2. **Given** multiple admins, **When** different admins create candidates, **Then** each candidate should correctly reference its specific creator.

---

### User Story 2 - Rejection Notification (Priority: P1)

When a candidate fails the pre-screening process (automatic rejection), the system must immediately notify the recruiter who created that candidate.

**Why this priority**: High. This directly fulfills the core requirement to prevent recruiters from scheduling unnecessary interviews.

**Independent Test**: Complete a pre-screening as a candidate with failing answers and verify the recruiter receives a notification email.

**Acceptance Scenarios**:

1. **Given** a candidate created by "recruiter@sofka.com.co", **When** they finish the pre-screening and are rejected, **Then** "recruiter@sofka.com.co" should receive an email reporting the rejection.
2. **Given** a rejection, **When** the system sends the notification, **Then** the email should include the candidate's name and the reason for rejection (reproach).

---

### User Story 3 - Retry Notification (Priority: P2)

When a candidate chooses to retry their evaluation, the recruiter who created them should be notified.

**Why this priority**: Medium. Provides visibility into the candidate's persistence and activity.

**Independent Test**: Use the "Retry" button as a candidate and verify the recruiter receives a notification email.

**Acceptance Scenarios**:

1. **Given** a rejected candidate, **When** they click "Retry", **Then** the associated recruiter should receive an email indicating the candidate has started a new attempt.
2. **Given** multiple retries (up to 3), **When** each retry occurs, **Then** a notification should be sent for each attempt.

---

### Edge Cases

- **Missing Recruiter Info**: What happens if a candidate was created by a system process or lacks a `created_by` email? (System should log a warning but skip notification).
- **Email Delivery Failure**: How does system handle failures in the notification service? (System should log the error but not block the candidate's flow).
- **Recruiter No Longer Active**: If the recruiter email is no longer valid, system should handle bounced emails as per standard SMTP policy.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST add a `created_by` field to the `users` and `history_candidates` database tables.
- **FR-002**: System MUST capture the current admin's session email during candidate creation and store it in `created_by`.
- **FR-003**: System MUST trigger an email notification to the address in `created_by` whenever a candidate's `evaluation_result.valid` status changes to `false`.
- **FR-004**: System MUST trigger an email notification to the address in `created_by` whenever the `/api/user/retry` endpoint is successfully called for a candidate.
- **FR-005**: All notifications MUST include the candidate's name, code, and the specific event (Rejection or Retry).

### Key Entities *(include if feature involves data)*

- **Candidate Profile**: Modified to include `created_by` attribute.
- **Notification**: A message entity sent via email to the recruiter.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of newly created candidates have a valid `created_by` email record.
- **SC-002**: Recruiter receives rejection notifications within 30 seconds of the candidate finishing the form.
- **SC-003**: Recruiter receives retry notifications within 30 seconds of the candidate confirming the retry action.
- **SC-004**: Zero "false positive" notifications (notifications sent to the wrong recruiter).
