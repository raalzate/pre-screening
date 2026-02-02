# Feature Specification: Candidate History Tab

**Feature Branch**: `011-candidate-history-tab`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description: "se debe tener un nuevo tab, muy relacionado con los filtros, para lograr consultar los registros hisotricos de los candidatos calificados (history_candidates)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Viewing Historical Candidates (Priority: P1)

As an administrator, I want to access a dedicated tab to view candidates who have already completed the process and were moved to the historical record.

**Why this priority**: Essential for record-keeping and auditing past hiring decisions without cluttering the active candidate view.

**Independent Test**: The "Historial" tab is visible and loads data from the `history_candidates` table.

**Acceptance Scenarios**:

1. **Given** I am on the Admin Dashboard, **When** I click on the "Historial" tab, **Then** I see a list of candidates from the historical records.
2. **Given** the list of historical candidates, **When** I scroll through the list, **Then** I can see their names, codes, and the date they were moved to history.

---

### User Story 2 - Filtering History (Priority: P2)

As an administrator, I want to filter the historical candidate list using the same criteria as the active list (requirements, status, etc.) to find specific past profiles.

**Why this priority**: High value for large databases where finding a specific past candidate manually is inefficient.

**Independent Test**: Applying a filter (e.g., search or requirement) in the History tab correctly sub-sets the historical data.

**Acceptance Scenarios**:

1. **Given** the History tab, **When** I type a candidate name in the search bar, **Then** only historical candidates matching that name are displayed.
2. **Given** the History tab, **When** I select a specific requirement filter, **Then** only historical candidates for that role are shown.
3. **Given** active filters in the "Candidatos" tab, **When** I switch to the "Historial" tab, **Then** the filters ARE maintained and applied to the historical view to allow tracking the same groups.

---

### User Story 3 - Restoration to Active (Priority: P2)

As an administrator, I want to restore a candidate from the history back to the active list if they were moved by mistake or need to re-enter the process.

**Why this priority**: Essential for error recovery and process flexibility.

**Independent Test**: Clicking "Restaurar" on a historical record successfully moves it back to the `users` (active) table and removes it from `history_candidates`.

**Acceptance Scenarios**:

1. **Given** a historical candidate, **When** I click "Restaurar", **Then** the candidate is visible again in the active list and removed from history.

---

### User Story 4 - Historical Date Range (Priority: P3)

As an administrator, I want to filter historical candidates by the date they were moved to history.

**Why this priority**: Useful for periodic reports (e.g., "Candidates moved to history this month").

**Independent Test**: Selecting a date range filter updates the list to show only candidates within those dates.

**Acceptance Scenarios**:

1. **Given** the History tab, **When** I select a date range (e.g., "Last 7 days"), **Then** the list shows candidates moved to history within that period.

### Edge Cases

- **Empty History**: What happens when the `history_candidates` table is empty?
- **Restoration Constraints**: Restoration should preserve the last known state of the candidate.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a new navigation tab labeled "Historial" (or similar) in the Admin Dashboard.
- **FR-002**: System MUST retrieve data from the `history_candidates` table when the History tab is active.
- **FR-003**: System MUST support the same filtering logic as the active candidates tab, and filters MUST be shared across both "Active" and "Historial" views.
- **FR-004**: System SHOULD display the `moved_at` timestamp for each record in the list.
- **FR-005**: System MUST allow filtering historical records by `moved_at` using an advanced date range selector (Calendar with Start/End dates).
- **FR-006**: System MUST provide a "Restaurar" action for historical records to move them back to the active list.

### Key Entities *(include if feature involves data)*

- **HistoryCandidate**: Represents a snapshot of a candidate when they were moved to history. Attributes include standard user fields plus `moved_at`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administrators can switch between "Active" and "History" views in under 500ms.
- **SC-002**: Filtering the historical list returns results in under 1 second for a dataset of 1000+ records.
- **SC-003**: 100% of candidates moved to history using existing functionality are visible in the new tab.
- **SC-004**: Users can identify when a candidate was moved to history by looking at the list entry.
