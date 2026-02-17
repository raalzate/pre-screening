# Feature Specification: Candidate Retry System

**Feature Branch**: `019-candidate-retry-system`  
**Created**: 2026-02-17  
**Status**: Draft  
**Input**: User description: "requiero tener un boton para reintantar, como candidato en el pre-screening inicial puedo ser rechazado, la idea es tener un boton donde reinicie todo y pueda tener como maximo 3 reintentos dentro del mismo codigo y requerimiento"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Candidate Re-attempts Pre-Screening (Priority: P1)

As a candidate who failed the initial pre-screening, I want to be able to restart my evaluation so I can correct my answers and try to pass again. I expect to see this option both immediately after failing and on my home/feedback dashboard.

**Why this priority**: High importance for user retention and candidate experience. It allows for error correction and "second chances" without administrative intervention.

**Independent Test**: Can be tested by failing a pre-screening form, clicking the "Retry" button from the result page or the home dashboard, and verifying that the form is reset and accessible again.

**Acceptance Scenarios**:

1. **Given** a candidate has failed the pre-screening evaluation, **When** they view their results page, **Then** they MUST see a "Retry" button showing the number of available attempts.
2. **Given** a candidate returns to the home dashboard after rejection, **When** they see their evaluation feedback, **Then** they MUST also see the "Retry" button with the remaining attempt count.
3. **Given** a candidate clicks the "Retry" button, **When** the action is confirmed, **Then** all previous answers for that profile MUST be cleared, and the candidate MUST be returned to the first question.

---

### User Story 2 - Retry Limit Enforcement & Visibility (Priority: P1)

As a business, I want to limit the frequency of re-attempts to 3 so that candidates do not brute-force the evaluation, and I want candidates to be clearly informed about their remaining chances.

**Why this priority**: Essential for maintaining the integrity and validity of the pre-screening phase.

**Independent Test**: Can be tested by clicking the "Retry" button 3 times and verifying that the button is disabled or hidden on the 4th attempt, and that the counter decrements correctly.

**Acceptance Scenarios**:

1. **Given** a candidate has already re-attempted the evaluation 3 times, **When** they view their results page or home dashboard, **Then** the "Retry" button MUST NOT be available.
2. **Given** a candidate is on their last attempt, **When** they view the retry option, **Then** the button text or a label MUST explicitly state "0 reintentos restantes" (or equivalent warning).
3. **Given** a candidate views the retry button, **Then** it MUST display the count of remaining attempts in a format such as "Reintentar (X intentos restantes)".

---

### Edge Cases

- **Multiple Requirements**: If a candidate has multiple active requirements, the retry limit MUST be tracked independently for each requirement profile.
- **Mid-form abandonment**: If a candidate restarts but doesn't finish, the attempt is still counted as soon as the "Retry" action is executed.
- **Admin deletion**: If an admin deletes a candidate, the retry history for that code is also removed (resetting to 0 if recreation occurs).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST track the number of retry attempts for each (candidate_code, requirements) pair.
- **FR-002**: System MUST persist the current attempt count in the database.
- **FR-003**: System MUST display a "Reintentar Evaluación" button only when the candidate's status for a specific requirement is "REJECTED" in the pre-screening phase.
- **FR-004**: System MUST allow a maximum of 3 re-attempts (total 4 attempts including the first one).
- **FR-005**: System MUST clear all previously stored answers for the specific requirement when a retry is initiated.
- **FR-006**: System MUST show the remaining attempts to the candidate before they confirm the retry.

### Key Entities *(include if feature involves data)*

- **Candidate Evaluation**: Updated to include `retry_count` (integer, default 0).
- **Evaluation History**: (Implicit) Records of previous attempts if needed for auditing, though the requirement implies a "reset" behavior.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Candidates can restart their evaluation in under 2 clicks after failing.
- **SC-002**: 100% of candidates who reach the 3-retry limit are prevented from starting a 4th re-attempt.
- **SC-003**: Form questions are cleared instantly (under 1 second) upon confirming a retry.
