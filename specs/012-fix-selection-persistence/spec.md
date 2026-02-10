# Feature Specification: Fix Selection Persistence in Admin Tabs

**Feature Branch**: `012-fix-selection-persistence`
**Created**: 2026-02-09
**Status**: Draft
**Input**: User description: "comportamiento no deseado en los tabs, cuando se selecionar condidatos y se selecciona uno y luego pasa a historial, resulta que se queda visible el candidato seleccionado, no deberia tener eso"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clear Candidate Selection on Tab Switch (Priority: P1)

As an administrator, I want the candidate selection to be cleared or hidden when I switch between tabs (e.g., from Active Candidates to History), so that I don't see irrelevant candidate details from a previous context.

**Why this priority**: It is a P1 bug fix. The current behavior causes confusion by showing a candidate from one list (Active) while the user is viewing another list (History), potentially leading to errors or a cluttered interface.

**Independent Test**: Can be fully tested by selecting a candidate in the "Technical" or "Active" tab, verifying the details are visible, then clicking the "History" tab and verifying the details panel disappears.

**Acceptance Scenarios**:

1. **Given** the admin is on the "Active Candidates" (Technical) tab and has selected a candidate (details panel is open), **When** the admin clicks on the "History" tab, **Then** the candidate details panel must close and the selection should be cleared.
2. **Given** the admin is on the "History" tab and has selected an item (if applicable), **When** the admin clicks on the "Active Candidates" tab, **Then** the previous selection from History should be cleared (or at least the UI shouldn't show a mix of states).
3. **Given** a candidate is selected in Tab A, **When** switching to Tab B and back to Tab A, **Then** the selection in Tab A can be either cleared or preserved (depending on desired UX, but for this fix, ensuring it doesn't bleed into Tab B is the priority). *Assumption: Clearing it is acceptable/safer.*

---

### Edge Cases

- **Rapid Tab Switching**: What happens if the user clicks between tabs very quickly?
  - *Expectation*: The state should consistently reflect the current active tab, clearing the selection immediately upon switch capability.
- **Deep Linking**: What happens if a user navigates directly to a tab via URL (if supported)?
  - *Expectation*: Selection state should be clean (null) initially.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST clear the currently selected candidate ID/State when the active tab changes in the Admin Dashboard.
- **FR-002**: The Candidate Details view/panel MUST NOT be visible when the user is on the "History" tab unless a specific history item is selected (if that feature exists). It MUST NOT show the candidate selected from the "Technical/Active" tab.
- **FR-003**: The selection state must be scoped to the active tab or reset globally on tab change.

### Key Entities

- **Admin Dashboard State**: Tracks `activeTab` and `selectedCandidateId`. These need to be coordinated.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of tab switches from "Active/Technical" to "History" result in the candidate details panel being closed.
- **SC-002**: No candidate details from the "Active" list are visible when the "History" tab is active.
