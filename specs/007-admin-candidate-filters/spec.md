# Feature Specification: Candidate Filters (Active vs Rejected)

**Feature Branch**: `007-admin-candidate-filters`  
**Created**: 2026-01-29  
**Status**: Draft  
**Input**: User description: "es necesario tener filtros uno para los que estan en proceso y otros lo que fueron rechazados (en el pre-screening) - quiero tenerlos separados"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Categorize Candidates by Status (Priority: P1)

As an Administrator, I want to separate candidates who failed the pre-screening from those who are still in the process, so that I can focus my attention on active candidates without being overwhelmed by the total number of entries.

**Why this priority**: It's the core requirement. Managing a growing list of candidates becomes difficult without status-based filtering.

**Independent Test**: Can be tested by selecting "En Proceso" and verifying that no candidates with a rejected pre-screening are shown, and then selecting "Rechazados" to see only those who failed.

**Acceptance Scenarios**:

1. **Given** the admin dashboard is open on the "Candidatos" view, **When** I select the "En Proceso" filter, **Then** only candidates with at least one valid profile (approved pre-screening) or pending pre-screening are displayed in the list.
2. **Given** the admin dashboard is open on the "Candidatos" view, **When** I select the "Rechazados" filter, **Then** only candidates whose profiles have all been rejected in pre-screening are displayed.
3. **Given** a filter is selected, **When** I use the search box, **Then** only candidates matching the search AND the current filter are shown.

---

### User Story 2 - Quick Count of Statuses (Priority: P2)

As an Administrator, I want to see the count of candidates in each category next to the filter labels, so that I have a quick overview of the recruitment funnel.

**Why this priority**: Provides useful metadata for decision making and overview.

**Independent Test**: Verify that the numbers displayed next to "En Proceso" and "Rechazados" match the actual number of candidates in those categories.

**Acceptance Scenarios**:

1. **Given** the candidate list is loaded, **When** I look at the filter options, **Then** I see the total count of candidates for each status (e.g., "Aprobados (15)", "Rechazados (45)").

---

### Edge Cases

- **Mixed Profiles**: If a candidate has multiple profiles (e.g., applied to two different roles) and one is rejected but another is pending or approved, they should appear in "En Proceso".
- **Empty States**: If no candidates match a specific filter, a clear "No candidates found for this status" message should be displayed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a toggle or selection UI (tabs or dropdown) to switch between candidate statuses.
- **FR-002**: Status categories MUST include: "Todos", "En Proceso", and "Rechazados".
- **FR-003**: A candidate MUST be classified as "Rechazado" only if all their evaluated profiles have an `evaluation_result.valid` set to `false`.
- **FR-004**: A candidate MUST be classified as "En Proceso" if at least one profile is either pending evaluation or has `evaluation_result.valid` set to `true`.
- **FR-005**: The filter selection MUST persist while searching by name or code.
- **FR-006**: The candidate count for each category MUST be updated in real-time based on the available data.

### Key Entities

- **GroupedCandidate**: Represents a person (identified by code) who may have one or more application profiles.
- **User (Profile)**: A specific application for a requirement (e.g., "pichincha-sr:springboot-backend"). Contains the `evaluation_result` which determines the rejection status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin can switch between status views in less than 200ms after interaction.
- **SC-002**: The list of candidates correctly reflects the selected status filter in 100% of cases.
- **SC-003**: The total count displayed in the filters matches the sum of entries when searching is cleared.

## Assumptions

- We determine a "rejected" candidate based on the `evaluation_result.valid` property being `false` for all their profiles.
- If a candidate has no `evaluation_result` yet, they are considered "En Proceso" (Pending).
