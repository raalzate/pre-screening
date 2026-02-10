# Feature Specification: Intermediate Option in Interview Wizard

**Feature Branch**: `013-interview-intermediate-option`
**Created**: 2026-02-10
**Status**: Draft
**Input**: User description: "en el Modo Entrevista Interactiva (wizard), existe dos opciones No Sabe y Satisfactorio - lo que deseo una tercera opcion que seria intermedia, esta deberia dejar continuar"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mark Answer as Intermediate (Priority: P1)

As an interviewer using the Interactive Interview Mode (Wizard), I want to be able to select an "Intermediate" option for a candidate's answer, so that I can record partial knowledge when the answer is neither fully correct nor completely missing.

**Why this priority**: It is the core request. The current binary options ("No Sabe" vs "Satisfactorio") do not capture the nuance of partial answers, forcing the interviewer to either over-grade or under-grade.

**Independent Test**:
1. Start an interview wizard session.
2. Select "Intermediate" for a question.
3. Verify the wizard advances to the next question.
4. Finish the interview and verify the result reflects the intermediate status/score.

**Acceptance Scenarios**:

1. **Given** the interviewer is on a question in the Wizard, **When** they click "Intermedio" (Intermediate), **Then** the system records the answer as intermediate AND automatically advances to the next question.
2. **Given** an interview with an "Intermediate" answer, **When** reviewing the results, **Then** that question should show as "Intermediate" (or partial score).

---

### Edge Cases

- **Last Question**: If "Intermediate" is selected on the last question, it should complete the interview (same as "Satisfactory").
- **Score Calculation**: How does "Intermediate" affect the total score?
  - *Assumption*: "Satisfactorio" = 100% (or 1 point). "No Sabe" = 0%. "Intermedio" = 50% (or 0.5 points).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Interview Wizard interface MUST display a third option labeled "Intermedio" (Intermediate) alongside "Satisfactorio" and "No Sabe".
- **FR-002**: Clicking "Intermedio" MUST advance the wizard to the next question immediately (similar to "Satisfactory").
- **FR-003**: The system MUST persist the "Intermediate" status for the specific question response.
- **FR-004**: The system MUST calculate a partial score for "Intermediate" answers (Default assumption: 50% value of a correct answer).

### Key Entities

- **InterviewResponse**: Needs to support a new status or value for "Intermediate". Current values might be boolean or enum.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Interviewers can complete a full interview session using only "Intermediate" answers.
- **SC-002**: The final score for an "Intermediate" answer is distinct from "Satisfactory" (100%) and "No Sabe" (0%).
