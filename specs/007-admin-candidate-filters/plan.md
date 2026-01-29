# Implementation Plan: Admin Candidate Filters

**Branch**: `007-admin-candidate-filters` | **Date**: 2026-01-29 | **Spec**: [/specs/007-admin-candidate-filters/spec.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/007-admin-candidate-filters/spec.md)
**Input**: Feature specification from `/specs/007-admin-candidate-filters/spec.md`

## Summary

Implement status-based filtering (All, In Progress, Rejected) for the candidate list in the admin dashboard. The filtering will be implemented client-side within the `AdminView` to provide instant feedback and reuse existing grouping logic.

## Technical Context

**Language/Version**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, Recharts, Zod
**Storage**: Turso (SQLite) - Read access for candidate list
**Testing**: `npm run lint` + Manual verification of filter logic
**Target Platform**: Vercel / Web
**Project Type**: Next.js Web Application
**Performance Goals**: Instant filtering (<200ms) for up to 500 candidates
**Constraints**: Must respect the existing `GroupedCandidate` structure from `adminUtils.ts`
**Scale/Scope**: ~100-500 candidates, 1 main admin dashboard file

## Constitution Check

- [x] **Architecture First**: Spec created in branch `007-admin-candidate-filters`.
- [x] **Type Safety**: Using existing TypeScript interfaces (`User`, `GroupedCandidate`).
- [x] **AI-Driven**: N/A for this UI feature.
- [x] **Tessl Alignment**: No new dependencies needed.
- [x] **Security**: UI-only change, respecting existing auth status.

## Project Structure

```text
app/
└── (public)/
    └── admin/
        └── page.tsx      # Entry point and filtering logic

lib/
└── adminUtils.ts        # Rejection logic helper
```

**Structure Decision**: Client-side filtering in `page.tsx` using `useMemo`.

## Proposed Changes

### Logic & Utilities

#### [MODIFY] [adminUtils.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/lib/adminUtils.ts)
- Add `isCandidateRejected(candidate: GroupedCandidate): boolean` to centralize the status logic.

### UI Layer

#### [MODIFY] [page.tsx](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/app/(public)/admin/page.tsx)
- Add `CandidateStatus` type: `'all' | 'in-progress' | 'rejected'`.
- Add `selectedStatus` state initialized to `'all'`.
- Update `filteredUsers` `useMemo` to filter candidates based on `selectedStatus` using the new helper.
- Update UI between View Toggle (Candidates/Forms) and Search Bar to include the Status Filter Tabs.
- Display candidate counts for each status within the tabs.

## Verification Plan

### Automated Tests
- `npm run lint`: Verify no TypeScript or ESLint regressions.

### Manual Verification
1. **Filtering Accuracy**:
    - Select "En Proceso" -> Verify only valid/pending candidates are shown.
    - Select "Rechazados" -> Verify only candidates with ALL profiles rejected are shown.
2. **Search + Filter**:
    - Select "Rechazados" and search for a specific name.
    - Verify only rejected candidates matching the name appear.
3. **UI/UX**:
    - Verify counts match the actual list size.
    - Verify responsive behavior on mobile.
