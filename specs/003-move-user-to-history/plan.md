# Implementation Plan: Candidate History Migration

**Branch**: `003-move-user-to-history` | **Date**: 2026-01-26 | **Spec**: [spec.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/003-move-user-to-history/spec.md)

## Summary

This feature implements a transactional migration of candidate records from the active `users` table to a `history_candidates` table once the final interview feedback is submitted. This ensures the admin panel remains performant and focused on active processes while preserving historical data.

## Technical Context

**Language/Version**: TypeScript / Next.js (App Router)  
**Primary Dependencies**: `@libsql/client` (Turso), `next-auth`  
**Storage**: Turso (SQLite/libsql)  
**Testing**: Manual walkthrough with Playwright  
**Target Platform**: Web (Admin Portal)
**Project Type**: Web application  
**Performance Goals**: API latency overhead < 200ms  
**Constraints**: Atomic transactional move operation  
**Scale/Scope**: 1:1 migration per feedback submission

## Constitution Check

- [x] **Architecture First**: Specification [spec.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/003-move-user-to-history/spec.md) and Plan [plan.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/003-move-user-to-history/plan.md) are defined.
- [x] **Type Safety**: Implementation will use TypeScript with strict types.
- [x] **AI-Driven**: N/A for this structural feature.
- [x] **Tessl Alignment**: No new dependencies expected.
- [x] **Security**: DB access is protected by API sessions and server-side logic.

## Project Structure

```text
src/
├── app/
│   └── api/
│       └── user/
│           └── feedback/
│               └── route.ts    # Implementation of migration
├── lib/
│   └── db.ts                   # Table initialization for history
└── types/                      # Shared entity types
```

**Structure Decision**: Web application layout. Logic will reside in the feedback API route to reuse existing session and database infrastructure.

## Phase 0: Outline & Research
Documented in [research.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/003-move-user-to-history/research.md).
- **Decision**: Use `db.batch()` for atomic move (Insert + Delete).
- **Decision**: Primary key `code` parity between tables.

## Phase 1: Design & Contracts
- **Data Model**: Defined in [data-model.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/003-move-user-to-history/data-model.md).
- **API Contract**: Defined in [contracts/migration.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/003-move-user-to-history/contracts/migration.md).
- **Setup Guide**: See [quickstart.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/003-move-user-to-history/quickstart.md).

## Verification Plan

### Automated Tests
- Playwright script to:
  1. Create a candidate.
  2. Navigate to Admin Panel.
  3. Submit feedback.
  4. Verify candidate is gone from UI.
  5. Verify candidate exists in `history_candidates` table (via DB query).

### Manual Verification
- Verify atomicity by forcing a database constraint error during migration and ensuring the user is NOT deleted from the active list.
