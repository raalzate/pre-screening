# Tasks: UI Identity Standardization

Standardization of graphic components and non-standard UI elements to improve UX and build a unique identity.

## Phase 1: Setup
- [x] T001 Initialize standardized component directory `components/ui`
- [x] T002 Configure theme tokens in `tailwind.config.ts` to strictly follow Sofka branding

## Phase 2: Foundational Components
- [x] T003 [P] Create `components/ui/Button.tsx` with standardized variants (Primary, Secondary, Ghost, Danger)
- [x] T004 [P] Create `components/ui/Card.tsx` with unified shadow and border styles
- [x] T005 [P] Create `components/ui/Badge.tsx` with status-based coloring
- [x] T006 [P] Create `components/ui/Modal.tsx` for consistent overlay behaviors

## Phase 3: User Story 1 - Interactive Component Migration [US1]
- [x] T007 [US1] Refactor `app/(public)/admin/page.tsx` to use `components/ui/Button.tsx`
- [x] T008 [US1] Refactor `app/(public)/admin/page.tsx` to use `components/ui/Card.tsx`
- [x] T009 [US1] Refactor `app/(public)/admin/page.tsx` to use `components/ui/Badge.tsx`
- [x] T010 [US1] Refactor `app/(public)/admin/page.tsx` to use `components/ui/Modal.tsx`

## Phase 4: User Story 2 - Non-Standard Visuals [US2]
- [x] T011 [US2] Update `components/GapAnalysisChart.tsx` to use Sofka theme colors in Recharts
- [x] T012 [US2] Standardize custom widgets in `app/(public)/admin/page.tsx` (e.g., info boxes, progress bars)

## Phase 5: User Story 3 - Spacing & Polish [US3]
- [x] T013 [US3] Audit and standardize vertical/horizontal spacing in all admin views
- [x] T014 [US3] Ensure WCAG accessibility compliance (contrast check) for all newly standardized elements

## Phase 6: Polish & Cross-Cutting Concerns
- [ ] T015 Final code cleanup of `app/(public)/admin/page.tsx` eliminating all dead inline component code
- [ ] T016 Verify build and production bundle consistency

## Dependencies
- [US1] depends on Foundational Components (Phase 2)
- [US2] depends on Foundational Components (Phase 2)
- [US3] depends on [US1] and [US2] completion

## Parallel Execution
- T003, T004, T005, T006 can be implemented in parallel.
- T011 can be implemented in parallel with [US1] tasks.
