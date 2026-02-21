# Tasks: Admin Studio Designer (023)

**Input**: Design documents from `/specs/023-admin-studio-designer/`
**Prerequisites**: [plan.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/023-admin-studio-designer/plan.md), [spec.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/023-admin-studio-designer/spec.md)

## Phase 1: Foundation & Data Layer

- [x] [T1.1] [P] [DB] Create table `studio_requirements` in `lib/db.ts` <!-- id: T1.1 -->
- [x] [T1.2] [P] [DB] Create table `studio_forms` in `lib/db.ts` <!-- id: T1.2 -->
- [x] [T1.3] [DB] Add helper functions for Requirement persistence in `lib/db.ts` <!-- id: T1.3 -->
- [x] [T1.4] [DB] Add helper functions for Form persistence in `lib/db.ts` <!-- id: T1.4 -->

## Phase 2: AI Logic (Genkit)

- [x] [T2.1] [IA] Implement `StudioRequirementGenerator` in `lib/ia/` <!-- id: T2.1 -->
- [x] [T2.2] [IA] Implement `StudioFormGenerator` in `lib/ia/` <!-- id: T2.2 -->
- [x] [T2.3] [IA] Validate generators against `data/descriptors.json` <!-- id: T2.3 -->

## Phase 3: API Endpoints (US1/US2)

- [x] [T3.1] [P] [API] Implement `POST /api/admin/studio/requirements/generate` <!-- id: T3.1 -->
- [x] [T3.2] [P] [API] Implement `POST /api/admin/studio/requirements` <!-- id: T3.2 -->
- [x] [T3.3] [P] [API] Implement `GET /api/admin/studio/requirements` <!-- id: T3.3 -->
- [x] [T3.4] [P] [API] Implement `POST /api/admin/studio/forms/generate` <!-- id: T3.4 -->
- [x] [T3.5] [P] [API] Implement `POST /api/admin/studio/forms` <!-- id: T3.5 -->
- [x] [T3.6] [P] [API] Implement `GET /api/admin/studio/forms` <!-- id: T3.6 -->

## Phase 4: Frontend Implementation (US1/US2/US3)

- [x] [T4.1] [UI] Build Studio Dashboard (`/admin/studio`) <!-- id: T4.1 -->
- [x] [T4.2] [UI] Build Requirement Designer View (`/admin/studio/requirements/new`) <!-- id: T4.2 -->
- [x] [T4.3] [UI] Build Form Designer View (`/admin/studio/forms/new`) <!-- id: T4.3 -->
- [x] [T4.4] [UI] Add "Register" integration to save drafts to DB <!-- id: T4.4 -->

## Phase 5: Verification & Polish

- [x] [T5.1] [VERIFY] Test full flow: Generate Requirements -> Save -> Generate Form -> Save <!-- id: T5.1 -->
- [x] [T5.2] [VERIFY] Verify database persistence of JSON objects <!-- id: T5.2 -->
- [x] [T5.3] [VERIFY] Run `npm run lint` and `npm test` <!-- id: T5.3 -->
