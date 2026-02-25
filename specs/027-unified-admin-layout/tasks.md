# Tasks: Unified Admin Layer Layout

**Input**: Design documents from `/specs/027-unified-admin-layout/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Create directory structure for admin components in `src/components/admin/`
- [x] T002 [P] Create initial blank components `AdminLayout.tsx`, `AdminSidebar.tsx`, `AdminHeader.tsx` in `src/components/admin/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Implement `AdminHeader.tsx` with logo and user logout logic using `useAuth`
- [x] T004 Implement `AdminSidebar.tsx` with the base navigation list for "Candidatos" and "Studio"
- [x] T005 Implement `AdminPageHeader.tsx` in `src/components/admin/` as requested in FR-006 (Standard Header)
- [x] T006 Implement `AdminLayout.tsx` as a wrapper that includes Sidebar, Header (top), and PageHeader slot
- [x] T007 [P] Create `AdminViewWrapper.tsx` in `src/components/admin/` for consistent margins and padding

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Unified Navigation Experience (Priority: P1) 🎯 MVP

**Goal**: Navigate between Dashboard and Studio Designer using a consistent sidebar.

**Independent Test**: Login as admin and verify the sidebar is present on both `/admin` (new protected) and `/admin/studio` routes.

### Implementation for User Story 1

- [x] T008 Move `app/(public)/admin/page.tsx` to `app/(protected)/admin/page.tsx`
- [x] T009 [P] Update `app/(protected)/admin/page.tsx` to use the new `AdminLayout` and `AdminPageHeader`
- [x] T010 Update `app/(protected)/admin/studio/layout.tsx` to use `AdminLayout`
- [x] T011 Update `app/(protected)/admin/studio/page.tsx` to use `AdminPageHeader` instead of local header logic
- [x] T012 Update navigation links in `AdminSidebar.tsx` to point to the correct protected routes
- [x] T013 Implement active tab highlighting in `AdminSidebar.tsx` using `usePathname()`

**Checkpoint**: User Story 1 is functional and testable independently.

---

## Phase 4: User Story 2 - Standardized Visual Identity (Priority: P2)

**Goal**: Dashboard and Studio share typography, colors, and header styles.

**Independent Test**: Visually verify that both pages use the same Sofka palette and font sizes for headers and interactive elements.

### Implementation for User Story 2

- [x] T014 Apply consistent typography and colors from `sofkaColors` to `AdminSidebar.tsx` and `AdminHeader.tsx`
- [x] T015 [P] Standardize button and input styles in `AdminPageHeader.tsx` using global UI atomics
- [x] T016 [P] Ensure consistent padding and spacing in `AdminViewWrapper.tsx` across all admin pages

**Checkpoint**: Visual consistency is achieved across all admin views.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final touches and responsive behavior.

- [x] T017 [P] Implement Bottom Navigation for mobile screens in `AdminLayout.tsx` (Edge Case)
- [x] T018 Update `app/(public)/admin/sign-in/page.tsx` (or equivalent) redirect logic to point to the new `/admin` location
- [x] T019 [P] Remove any redundant local auth checks in the newly protected pages
- [x] T021 [P] Update `app/(protected)/layout.tsx` to redirect to `/admin/sign-in` for admin paths when unauthenticated
- [x] T022 Update `context/AuthContext.tsx` logout logic to choose `callbackUrl` dynamically based on pathname

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories.
- **User Story 2 (P2)**: Depends on visual elements defined in Phase 2 but can run in parallel with US1 implementation logic.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Verify consistent navigation.

### Incremental Delivery

1. Foundation ready.
2. Unified Navigation (US1) → Functional dashboard parity.
3. Visual polish (US2) → Premium look & feel.
4. Mobile support & cleanup.
