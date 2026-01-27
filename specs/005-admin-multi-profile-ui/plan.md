# Implementation Plan: Admin Multi-Profile UI

**Branch**: `005-admin-multi-profile-ui` | **Date**: 2026-01-27 | **Spec**: [spec.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/005-admin-multi-profile-ui/spec.md)

## Summary

This feature updates the Admin UI to better support the multi-profile data structure. Key changes:
1.  **Deduplicated Dashboard**: Group candidates by `code` so duplications are hidden.
2.  **Multi-Select Creation**: Allow assigning multiple profiles during candidate registration.
3.  **Grouped Detail View**: View all profiles for a single code in a tabbed interface.

## Technical Context

**Language/Version**: TypeScript / Next.js (App Router)
**Primary Dependencies**: React (State, Effects)
**Storage**: N/A (Frontend logic primarily)
**Testing**: Manual End-to-End Walkthrough
**Target Platform**: Web (Admin Portal)
**Project Type**: Web application
**Performance Goals**: Grouping 100+ candidates in <100ms
**Constraints**: Must work with existing `/api/user` endpoints.

## Constitution Check

- [x] **Architecture First**: Spec and Plan created.
- [x] **Type Safety**: New grouping types defined in TypeScript.
- [x] **Documentation**: Grouping logic documented in research.md.

## Project Structure

```text
app/
└── (public)/
    └── admin/
        ├── page.tsx            # Updated with grouping logic
        └── components/
            ├── CandidateList.tsx # New grouped list component (refactor)
            ├── ProfileTabs.tsx   # New detail view component
            └── RegisterModal.tsx # Updated with checkbox group
```

**Structure Decision**: Integrated into `admin` directory.

## Phase 0: Outline & Research
Documented in [research.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/005-admin-multi-profile-ui/research.md).
- **Decision**: Grouping happens on Client Side.
- **Decision**: Creation loop happens on Client Side (`Promise.all`).

## Phase 1: Design & Contracts
- **Data Model**: [data-model.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/005-admin-multi-profile-ui/data-model.md).
- **Setup Guide**: [quickstart.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/005-admin-multi-profile-ui/quickstart.md).

## Verification Plan

### Automated Tests
- N/A for UI logic (Project relies on manual verification).

### Manual Verification (End-to-End)
**Scenario: Full Lifecycle Test**
1.  **Admin**: Create Candidate "Jane Doe" with profiles [Angular, Java].
2.  **Verify**: "Jane Doe" appears ONCE in the list.
3.  **Verify**: Selecting Jane shows 2 tabs (Angular, Java).
4.  **Candidate**: Login as Jane.
5.  **Verify**: Select "Angular". Complete form. Submit.
6.  **Admin**: Refresh. Verify "Angular" tab for Jane shows progress. "Java" tab stays "Welcome".
