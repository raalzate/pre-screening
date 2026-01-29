# Tasks: Admin Process Step Filters

- [x] Phase 1: Logic & State <!-- id: 100 -->
    - [x] Add `CandidateStepFilter` type and `stepFilter` state in `app/(public)/admin/page.tsx` <!-- id: 101 -->
    - [x] Implement `stepFilter` reset logic when status filter changes <!-- id: 102 -->
    - [x] Update `filteredUsers` useMemo to include step filtering <!-- id: 103 -->
    - [x] Update `statusCounts` to include counts for each process step <!-- id: 104 -->
- [x] Phase 2: UI Implementation <!-- id: 200 -->
    - [x] Create Step Tags (Chips) UI component in `page.tsx` <!-- id: 201 -->
    - [x] Integrate tags secondary row into the dashboard layout <!-- id: 202 -->
- [x] Phase 3: Verification <!-- id: 300 -->
    - [x] Verify default behavior (Challenge active when In Process selected) <!-- id: 301 -->
    - [x] Verify accurate counts for each step <!-- id: 302 -->
    - [x] Run `npm run lint` <!-- id: 303 -->
