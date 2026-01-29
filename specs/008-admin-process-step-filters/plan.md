# Implementation Plan: Admin Process Step Filters

**Branch**: `008-admin-process-step-filters` | **Date**: 2026-01-29 | **Spec**: [/specs/008-admin-process-step-filters/spec.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/008-admin-process-step-filters/spec.md)
**Input**: Feature specification from `/specs/008-admin-process-step-filters/spec.md`

## Summary

Implement a second row of filters ("Tags") that appear when viewing candidates "En Proceso". These tags correspond to the `step` of the candidate's profiles. By default, when switching to "En Proceso", the filter will automatically select "Validación Técnica" (Challenge).

## Technical Context

**Language/Version**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, Recharts
**Storage**: Turso (SQLite)
**Testing**: `npm run lint` + Manual verification of state transitions
**Target Platform**: Vercel / Web
**Project Type**: Next.js Web Application
**Performance Goals**: Instant filtering (<100ms) for sub-categories
**Constraints**: Must manage complex state where a candidate might have multiple profiles in different steps
**Scale/Scope**: Adding 1 new state variable and ~4 UI components (tags)

## Constitution Check

- [x] **Architecture First**: Spec created in branch `008-admin-process-step-filters`.
- [x] **Type Safety**: New `CandidateStepFilter` type defined.
- [x] **AI-Driven**: N/A for this UI feature.
- [x] **Tessl Alignment**: No new dependencies needed.
- [x] **Security**: UI-only change.

## Project Structure

```text
app/
└── (public)/
    └── admin/
        └── page.tsx      # Entry point and filtering logic
```

**Structure Decision**: Integrated within `page.tsx`.

## Proposed Changes

### UI Layer

#### [MODIFY] [page.tsx](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/app/(public)/admin/page.tsx)
- Add `CandidateStepFilter` type: `'all' | 'pre-screening' | 'technical' | 'interview'`.
- Add `stepFilter` state initialized to `'technical'`.
- Update the `setStatusFilter` handler to reset `stepFilter` to `'technical'` when "En Proceso" is selected.
- Implement a secondary filter row using the "Tags/Chips" UI pattern.
- Update `filteredUsers` `useMemo` to include the `stepFilter` logic:
    - If a step is selected, only show candidates having at least one profile in that step (and matching search/status).
- Update `statusCounts` logic to also calculate counts for each step.

## Verification Plan

### Automated Tests
- `npm run lint`: Verify no regressions.

### Manual Verification
1. **Defaulting**:
    - Select "Todos" status -> Sub-filters hidden.
    - Select "En Proceso" status -> Sub-filters appear, "Validación Técnica" is auto-selected.
2. **Filtering Accuracy**:
    - Select "Pre-Screening" tag -> Only candidates with profiles in pre-screening are shown.
3. **Multi-profile**:
    - Verify that if a candidate has one profile in `technical` and another in `interview`, they appear when either tag is selected.
