# Tasks: Admin View Forms

This file defines the atomic, dependency-ordered tasks for implementing the Admin View Forms feature.

## Phase 1: Setup & Foundation

- [x] T001 Create administrative API directory structure in `app/api/admin/forms/`.
- [x] T002 [P] Implement `GET /api/admin/forms` to list all form templates in `app/api/admin/forms/route.ts`.
- [x] T003 [P] Implement `GET /api/admin/forms/[id]` to retrieve full form detail in `app/api/admin/forms/[id]/route.ts`.

## Phase 2: [US1] Access and View Form List

- [ ] T004 [US1] Add `view` state (`'candidates' | 'forms'`) and toggle UI in `app/(public)/admin/page.tsx`.
- [ ] T005 [P] [US1] Create `AdminFormsView` component scaffold in `components/admin/AdminFormsView.tsx`.
- [ ] T006 [US1] Implement form list fetching and display in `AdminFormsView.tsx`.

**Independent Test**:
- Log in as Admin.
- Switch to "Formularios" view.
- Verify that a list of active forms is correctly displayed.

## Phase 3: [US2] View Form Content Details

- [ ] T007 [P] [US2] Create `FormPreview` read-only component in `components/admin/FormPreview.tsx`.
- [ ] T008 [US2] Integrate `FormPreview` into the detail view of `AdminFormsView.tsx`.
- [ ] T009 [US2] Implement "Back to List" navigation in the form detail view.

**Independent Test**:
- From the Forms list, select a specific form.
- Verify that all questions and categories are displayed correctly.
- Verify that no inputs are editable.

## Phase 4: Polish & Refinement

- [ ] T010 [P] Add loading spinners and error messages for form transitions.
- [ ] T011 Ensure the forms list and preview are responsive for mobile viewing.

## Dependencies

1. **[US1]** depends on **T001**, **T002**.
2. **[US2]** depends on **[US1]**, **T003**.

## Parallel Execution Opportunities

- T002 and T003 can be developed in parallel once T001 is done.
- T005 and T007 can be prototyped in parallel as UI skeletons.
- T010 and T011 can be done after functional stories are complete.

## Implementation Strategy

- **MVP**: Complete US1 and US2. This provides full visibility into the forms as requested.
- **Next Steps**: Future enhancements could include form versioning or metadata tags, but are out of scope for this task.
