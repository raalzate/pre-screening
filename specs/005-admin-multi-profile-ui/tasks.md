# Tasks: Admin Multi-Profile UI

## Phase 1: Core Logic (Client-Side)
- [x] T001 Implement `groupCandidatesByCode` utility function in `components/admin` or `lib/utils`.
- [x] T002 Update `app/(public)/admin/page.tsx` to fetch users and map them using the grouping utility.

## Phase 2: Dashboard UI Updates
- [x] T003 Update `components/admin/AdminFormsView.tsx` (or main list) to render `GroupedCandidate` items.
    - [x] List View: Show Name + Code + "N Profiles".
    - [x] Detail View: Implement Tabs for each profile.

## Phase 3: Registration Modal
- [x] T004 Update `components/admin/RegisterCandidateModal.tsx` (if it exists, otherwise find where creation happens).
    - [x] Change `requirements` select to Checkbox or Multi-Select.
    - [x] Update `handleSubmit` to loop through selected requirements and call `POST /api/user` for each.

## Phase 4: Verification
- [x] T005 Manual walkthrough: Create multi-profile user, verify list grouping, verify detail tabs.
