# Implementation Plan: [FEATURE]

**Branch**: `017-candidate-self-deletion` | **Date**: 2026-02-13 | **Spec**: [spec.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/017-candidate-self-deletion/spec.md)
**Input**: Feature specification from `/specs/017-candidate-self-deletion/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature allows candidates to voluntarily withdraw from the selection process through their portal. The system will implement a "Soft Delete" strategy, moving the candidate's active profiles to a `history_candidates` table with a 'Withdrawn' status to maintain an audit trail. Administrators will receive a dashboard notification upon withdrawal.

## Technical Context

**Language/Version**: TypeScript / Next.js 15 (App Router) + React 19
**Primary Dependencies**: `next-auth`, `@libsql/client` (Turso)
**Storage**: Turso (LibSQL / SQLite)
**Testing**: Manual verification, Playwright
**Target Platform**: Web (Vercel)
**Project Type**: Web
**Performance Goals**: API response time < 200ms
**Constraints**: Confirmation modals required, immediate session invalidation
**Scale/Scope**: Small to Medium (current active candidate pool)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Architecture First**: ✓ Feature defined in `spec.md` and `plan.md`.
- **Type Safety**: ✓ Will use TypeScript for new API routes and portal updates.
- **AI-Driven**: N/A (Standard CRUD logic).
- **Tessl Alignment**: ✓ Dependencies will be checked against `tessl.json`.
- **Security**: ✓ Will ensure session invalidation upon withdrawal as per [FR-004].

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── api/
│   │   ├── user/
│   │   │   └── withdraw/    # [NEW] API for self-deletion
│   │   └── admin/
│   │       └── notifications/ # [NEW] API for dashboard alerts
│   └── (public)/
│       └── portal/          # Candidate interaction UI
├── components/
│   └── WithdrawButton.tsx   # [NEW] Component for withdrawal
└── lib/
    ├── db.ts                # Database migration for notifications
    └── auth.ts              # Handling logout/session invalidation
```

**Structure Decision**: Option 2: Web application (Next.js App Router).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
