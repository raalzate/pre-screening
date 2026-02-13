# Feature Specification: Candidate Self-Deletion

**Feature Branch**: `017-candidate-self-deletion`  
**Created**: 2026-02-12  
**Status**: Draft  
**Input**: User description: "quiero tener una opcion en donde el usuario se da de baja del proceso, es decir, se elimina asi mismo, quiero una opcion voluntaria en donde el candidato puede darse de baja"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Voluntary Process Withdrawal (Priority: P1)

As a candidate currently in the selection process, I want to be able to voluntarily withdraw myself from the process so that I no longer receive reminders and my data is removed from the active selection pipeline.

**Why this priority**: It's the core requirement. It empowers candidates with control over their participation and aligns with privacy best practices.

**Independent Test**: Can be tested by a candidate clicking a "Withdraw" button in their portal, confirming, and then verifying they can no longer access the evaluation with their code.

**Acceptance Scenarios**:

1. **Given** a candidate is logged into their evaluation portal, **When** they select the "Withdraw from process" option and confirm, **Then** their active profiles must be removed from the active list.
2. **Given** a candidate has withdrawn from the process, **When** they attempt to login again with their original code, **Then** the system must deny access.

---

### User Story 2 - Accidental Withdrawal Protection (Priority: P2)

As a candidate, I want to confirm my decision to withdraw so that I don't accidentally terminate my application due to a misclick.

**Why this priority**: Essential for UX to prevent irreversible data loss or process termination.

**Independent Test**: Click withdrawal option and verify that a confirmation dialog appears before any data is deleted.

**Acceptance Scenarios**:

1. **Given** a candidate clicks "Withdraw", **When** the confirmation modal appears and they click "Cancel", **Then** no deletion should occur and they should remain on the same page.
2. **Given** a candidate clicks "Withdraw", **When** they click "Confirm Withdraw", **Then** the process should proceed to deletion.

---

### Edge Cases

- **Multiple Profiles**: If a candidate has multiple active profiles (e.g., Senior and Junior), withdrawing should remove ALL of them associated with that candidate code.
- **Mid-Evaluation**: If a candidate withdraws while in the middle of a certification challenge, the session should be terminated and results discarded.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Candidate Portal MUST include a visible "Withdraw from Process" option (e.g., in the header or footer).
- **FR-002**: System MUST display a clear confirmation message explaining the consequences of withdrawal (e.g., "This will permanently remove your application").
- **FR-003**: System MUST move the candidate data to the History table with a 'Withdrawn' status (Soft Delete) to maintain an audit trail.
- **FR-004**: Once withdrawal is confirmed, the system MUST invalidate the candidate's access code immediately.
- **FR-005**: System MUST provide a dashboard alert or notification to the administrator when a candidate self-withdraws.

### Key Entities

- **User (Candidate)**: Represents the person in the process. Key attributes: `code`, `email`, `status`.
- **History Candidate**: If soft-deletion is chosen, this entity will store the record of the withdrawal.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Candidates can complete the withdrawal process in fewer than 3 clicks from their main portal.
- **SC-002**: 100% of withdrawn candidate codes fail authentication immediately after confirmation.
- **SC-003**: Administrators can see withdrawn candidates in the history view (if soft-delete) or notice their removal from the active list (if hard-delete).
