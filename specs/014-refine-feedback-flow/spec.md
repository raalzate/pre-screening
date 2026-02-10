# Feature Specification: Refine Feedback Flow & Fix Candidate Search

**Feature Branch**: `014-refine-feedback-flow`
**Created**: 2026-02-10
**Status**: Draft
**Input**: User description: "al dar el feedback se esta moviendo todo basado en el codigo, pero es necesario que se mueva segun requerimiento, es decir si yo doy feedback a un candiado le doy feedback segun el requerimiento y el codigo, se debe movel al historico, ademas, estoy buscando el candidato y esta saliendo 'Usuario no encontrado' pero si existe"

## User Scenarios & Testing *(mandatory)*

### 1. Feedback Scoped by Requirement (Priority: P1)
**Reason**: Currently, feedback applies to the candidate globally via their `code`. The user needs to evaluate a candidate *per requirement* (e.g., "Fullstack Dev" vs "Backend Dev").
**Scenario**:
1.  **Given** a candidate applied to multiple requirements (e.g., Req A, Req B).
2.  **When** the interviewer selects the candidate within the context of **Req A**.
3.  **And** provides feedback/decision (Pass/Fail).
4.  **Then** the decision is recorded specifically for **Req A**.
5.  **And** the candidate moves to "History" for **Req A**, but remains active for **Req B** (if pending).

*Assumption for MVP*: If the system isn't fully set up for multi-requirement tracking per candidate yet, at minimum, the action of giving feedback should move the candidate to history *for the current context*. The user emphasized "se debe mover al historico".

### 2. Move to History on Feedback (Priority: P1)
**Scenario**:
1.  **Given** an active candidate in the "Candidatos" tab.
2.  **When** I save feedback/decision (Pass/Fail).
3.  **Then** the candidate should disappear from the "Active" list and appear in the "History" tab.

### 3. Fix "User Not Found" Search Bug (Priority: P0 - Critical)
**Scenario**:
1.  **Given** a candidate exists in the database (I can see them in the list).
2.  **When** I search for them by name or code.
3.  **Then** the system should find and display the candidate.
4.  **Current Bug**: It says "Usuario no encontrado" even if they exist.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Feedback submission MUST identify both the candidate (`code`) AND the specific requirement (`requirement_id` or `profile`).
- **FR-002**: Upon saving final feedback (Pass/Fail), the system MUST update the candidate's status to "Completed" (or similar) for that requirement.
- **FR-003**: Candidates with "Completed" status for a requirement MUST NOT appear in the "Active" list for that requirement.
- **FR-004**: The Search function MUST correctly query the candidate database by Name or Code without false negatives.

### Key Entities

- **Candidate**: Needs to support status *per requirement* or have a global status that transitions correctly.
- **Feedback**: Must link to `(candidate_code, requirement)`.

## Success Criteria *(mandatory)*

- **SC-001**: Submitting feedback moves the candidate from "Active" to "History" immediately.
- **SC-002**: Searching for an existing candidate returns the correct result.
- **SC-003**: Feedback is associated with the correct requirement context.

## Assumptions

- We assume the database schema supports linking feedback to a requirement. If not, we might need a schema migration or a workaround (e.g., storing requirement in the feedback metadata).
- "Requirement" refers to the job profile or position the candidate is being evaluated for.
