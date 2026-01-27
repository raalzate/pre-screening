# Implementation Plan: Multi-Profile Selection

**Branch**: `004-multi-profile-selection` | **Date**: 2026-01-27 | **Spec**: [spec.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/004-multi-profile-selection/spec.md)

## Summary

This feature enables the assignment of multiple profiles (requirements) to a single candidate code. To achieve this, the database schema will be updated to allow multiple rows per `code` (removing the unique constraint on `code`). A new composite primary key (`code`, `requirements`) will be introduced. The candidate landing page will be updated to allow the user to select which profile they wish to proceed with, effectively branching their application process.

## Technical Context

**Language/Version**: TypeScript / Next.js (App Router)  
**Primary Dependencies**: `@libsql/client` (Turso)  
**Storage**: Turso (SQLite/libsql) - Schema Migration Required  
**Testing**: Manual walkthrough  
**Target Platform**: Web (Admin & Candidate Portal)  
**Project Type**: Web application  
**Performance Goals**: Instant profile switching  
**Constraints**: Must maintain backward compatibility for existing single-profile candidates.  
**Scale/Scope**: Impacts all new multi-profile candidates.

## Constitution Check

- [x] **Architecture First**: Spec and Plan created.
- [x] **Type Safety**: New schema logic will be typed.
- [x] **Documentation**: Schema changes documented in research.md.
- [x] **Security**: Candidate access still guarded by `code`.

## Project Structure

```text
src/
├── app/
│   ├── (public)/
│   │   └── welcome/
│   │       └── page.tsx      # Updated to handle profile selection
│   └── api/
│       └── user/
│           └── verify/
│               └── route.ts  # Updated to return list of profiles
├── components/
│   └── ProfileSelector.tsx   # New component for selection UI
└── lib/
    └── db.ts                 # Schema migration logic
```

**Structure Decision**: Web application layout. Logic spread across API (data access) and Frontend (selection UI).

## Phase 0: Outline & Research
Documented in [research.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/004-multi-profile-selection/research.md).
- **Decision**: Use Composite Primary Key (`code`, `requirements`).
- **Decision**: Update API to return a list of profiles if multiple matches found.

## Phase 1: Design & Contracts
- **Data Model**: [data-model.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/004-multi-profile-selection/data-model.md).
- **API Contract**: [contracts/multi-profile.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/004-multi-profile-selection/contracts/multi-profile.md).
- **Setup Guide**: [quickstart.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/004-multi-profile-selection/quickstart.md).

## Verification Plan

### Automated Tests
- Create a script `scripts/test_multi_profile.ts` that:
  1. Inserts a user with multiple rows (same code, diff requirements).
  2. Queries by code and verifies multiple results returned.

### Manual Verification
- **Admin**: Create a user with 2 profiles. Check DB.
- **Candidate**: Log in with that code. Verify selection screen. Choose one. Verify redirect.
