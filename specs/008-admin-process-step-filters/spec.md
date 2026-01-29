# Feature Specification: Candidate Step Filters (In Process Only)

**Feature Branch**: `008-admin-process-step-filters`  
**Created**: 2026-01-29  
**Status**: Draft  
**Input**: User description: "para los filtros que esta 'en proceso' debe tener filtros segun el step - se espera tener filtros por steps pero solo los que estan en proceso"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Refine Active Candidates by Step (Priority: P1)

As an Administrator, when I have the "En Proceso" status filter active, I want to see a sub-selection of steps (Pre-Screening, Técnica, Entrevista), so that I can quickly identify which candidates are at specific stages of the recruitment funnel.

**Why this priority**: It allows for more granular management of the recruitment process, which is critical when dealing with many active candidates.

**Independent Test**: Can be tested by selecting "En Proceso" and then clicking on "Técnica" to verify that only candidates with at least one profile in the "technical" step (and not rejected) are shown.

**Acceptance Scenarios**:

1. **Given** the "En Proceso" filter is active, **When** I look at the UI, **Then** I see sub-filters for "Todos", "Pre-Screening", "Validación Técnica", and "Entrevista".
2. **Given** "En Proceso" is active, **When** I select "Validación Técnica", **Then** the list only shows candidates who have at least one profile with `step === 'technical'` and which has not been rejected.
3. **Given** sub-filters are visible, **When** I switch the main status filter to "Rechazados", **Then** the sub-filters should be hidden or disabled (as they only apply to active candidates).
4. **Given** a sub-filter is active, **When** I use the search box, **Then** it filters by Status AND Step AND Search Query.

---

### User Story 2 - Real-time Counts for Steps (Priority: P2)

As an Administrator, I want to see how many candidates are in each step within the sub-filter labels, so that I can see the distribution of candidates across the funnel.

**Why this priority**: Provides instant quantitative feedback on the process state.

**Independent Test**: Verify that the counts in the sub-filters match the actual number of candidates displayed when that sub-filter is selected.

**Acceptance Scenarios**:

1. **Given** "En Proceso" is active, **When** I look at the step tabs, **Then** I see the count for each (e.g., "Pre-Screening (10)", "Técnica (5)").

---

### Edge Cases

- **Multi-step Candidates**: A candidate with profiles in two different steps (e.g., Profile A in `technical`, Profile B in `pre-screening`) should appear in both sub-filters when selected.
- **Empty Steps**: Steps with zero candidates should still be visible but perhaps styled as empty or showing (0).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST show a secondary filter row ONLY when "En Proceso" (or "Todos") is selected in the main status filter.
- **FR-002**: Sub-filters MUST include: "Todos los pasos", "Pre-Screening", "Validación Técnica", and "Entrevista".
- **FR-003**: The sub-filter for "Pre-Screening" MUST match profiles with `step === 'pre-screening'`.
- **FR-004**: The sub-filter for "Validación Técnica" MUST match profiles with `step === 'technical'`.
- **FR-005**: The sub-filter for "Entrevista" MUST match profiles with `step === 'interview'`.
- **FR-006**: A candidate matches a step filter if they are NOT "Rechazado" overall AND they have at least one profile in that specific step.
- **FR-007**: Counts MUST be calculated based on the active set of "In Process" candidates.

### Key Entities

- **GroupedCandidate**: The main entry in the list.
- **User (Profile)**: Its `step` property is used for internal filtering.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Sub-filters are displayed/hidden correctly when switching main statuses in under 100ms.
- **SC-002**: The candidate count for each step is accurate and updates when candidates are added/modified.
- **SC-003**: Clicking a step sub-filter applies the filter instantly (<200ms).

## Assumptions

- We map `technical` step to "Validación Técnica" and `interview` to "Entrevista".
- We map `pre-screening` step to "Pre-Screening".
- These sub-filters are only relevant for candidates who are still in process.
