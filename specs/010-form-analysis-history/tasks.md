# Tasks: Historical AI Form Analysis Results

**Input**: Design documents from `specs/010-form-analysis-history/`
**Prerequisites**: [plan.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/010-form-analysis-history/plan.md), [spec.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/010-form-analysis-history/spec.md)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Verify `tessl.json` contains current dependencies (`@libsql/client`, `genkit`)
- [ ] T002 [P] Research existing SQL migration patterns in `lib/db.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure for persistence

- [ ] T003 Update `lib/db.ts` to include `form_analyses` table schema
- [ ] T004 Implement `initDb` logic in `lib/db.ts` for the new table
- [ ] T005 Verify database connectivity and table creation via a simple script or log check

**Checkpoint**: Foundation ready - history persistence can now be implemented

---

## Phase 3: User Story 1 - Persist AI Analysis (Priority: P1) 🎯 MVP

**Goal**: Automatically save generated AI analyses to the database

**Independent Test**: Generate an analysis, then query the `form_analyses` table directly to verify persistence.

### Implementation for User Story 1

- [ ] T006 [US1] Create database helper functions for saving analysis in `lib/db.ts`
- [ ] T007 [US1] Update `app/api/admin/forms/analysis/route.ts` to call the save helper after generation
- [ ] T008 [US1] Remove or complement `localStorage` caching with database persistence in `components/admin/FormPreview.tsx`

**Checkpoint**: Analyses are now persisted in the backend.

---

## Phase 4: User Story 2 - View Analysis History List (Priority: P2)

**Goal**: Provide a UI to view previous reports for a form

**Independent Test**: Open the "Formularios" panel, click "Ver Historial" on a form, and see a list of past reports.

### Implementation for User Story 2

- [ ] T009 [P] [US2] Create API endpoint `app/api/admin/forms/history/[id]/route.ts` to fetch records
- [ ] T010 [US2] Create modal component `components/admin/FormHistoryModal.tsx` to display records
- [ ] T011 [US2] Update `components/admin/AdminFormsView.tsx` to include an action button for history
- [ ] T012 [US2] Implement "View Full Report" functionality in the modal using `react-markdown`

---

## Phase 5: User Story 3 - Compare Historical Results (Priority: P3)

**Goal**: Summarize scores and trends in the history list

**Independent Test**: Verify that the history list shows scores and percentages clearly for visual comparison.

### Implementation for User Story 3

- [ ] T013 [US3] Enhance `FormHistoryModal.tsx` list items to display score percentage and affinity level
- [ ] T014 [US3] Add sorting to the history API or UI (newest first)

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T015 [P] Cleanup unused `localStorage` logic related to analysis cache
- [ ] T016 [P] Add error handling for empty history states in UI
- [ ] T017 Final validation using [quickstart.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/010-form-analysis-history/quickstart.md)

---

## Dependencies & Execution Order

- **Foundational (Phase 2)**: MUST complete T003-T004 before US1.
- **User Story 1**: Core prerequisite for US2 (no history without saved data).
- **User Story 2**: Depends on API from and data from US1.

---

## Parallel Opportunities

- T009 (API History) can be implemented in parallel with T010 (UI Modal) once the data model is settled.
- T015-T016 can be done anytime after US2 is functional.

---

## Implementation Strategy

1. **DB First**: Ensure data has a place to live (`form_analyses` table).
2. **Writer Next**: Update the generation flow to write to the DB.
3. **Reader Last**: Build the UI to consume the history.
