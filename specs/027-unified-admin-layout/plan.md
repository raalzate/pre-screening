# Implementation Plan: Unified Admin Layer Layout

**Branch**: `027-unified-admin-layout` | **Date**: 2026-02-25 | **Spec**: [spec.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/027-unified-admin-layout/spec.md)
**Input**: Feature specification from `/specs/027-unified-admin-layout/spec.md`

## Summary

Unify the architectural design and layout of the admin layer by creating a shared `AdminLayout` component. This involves moving the admin dashboard from a public route to a protected one, standardizing on a sidebar-based navigation system, and ensuring a consistent visual identity (typography, colors, headers) across all administrative views.

## Technical Context

**Language/Version**: TypeScript / Next.js 15 (App Router) + React 19
**Primary Dependencies**: Tailwind CSS, `next-auth`, `@libsql/client`, `react-hot-toast`
**Storage**: Turso (LibSQL / SQLite)
**Testing**: `npm test` && `npm run lint`
**Target Platform**: Web (Vercel)
**Project Type**: Web application
**Performance Goals**: < 2s Largest Contentful Paint (LCP), < 100ms Interaction to Next Paint (INP)
**Constraints**: MUST leverage existing `sofkaColors` and `ProtectedLayout` logic. MUST be highly reusable as requested.
**Scale/Scope**: Unified dashboard for candidate management, process history, and Studio (Requirements/Forms).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| Architecture First | ✅ PASS | Specification and planning artifacts created. |
| Type Safety | ✅ PASS | All new components/layouts will use strict TypeScript. |
| AI-Driven | ✅ PASS | Follows established Genkit patterns where applicable. |
| Tessl Alignment | ✅ PASS | No new external dependencies required. |
| Security | ✅ PASS | Moving dashboard to protected routes enhances security. |

## Project Structure

### Documentation (this feature)

```text
specs/027-unified-admin-layout/
├── plan.md              # This file
├── research.md          # [NEEDS CREATION] Phase 0 output
├── data-model.md        # [NEEDS CREATION] Phase 1 output
├── quickstart.md        # [NEEDS CREATION] Phase 1 output
├── contracts/           # [NEEDS CREATION] Phase 1 output
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx       # [NEW] Shared admin wrapper
│   │   ├── AdminSidebar.tsx      # [NEW] Common navigation
│   │   └── AdminHeader.tsx       # [NEW] Common header
│   └── ui/                       # Shared UI atomics
└── app/
    ├── (protected)/
    │   ├── admin/                # [MOVE FROM PUBLIC]
    │   │   ├── page.tsx          # Main dashboard
    │   │   ├── history/          # History view
    │   │   └── studio/           # Existing studio routes
    │   └── layout.tsx            # Base protected layout
    └── (public)/
        └── admin/                # [REDUCE TO LOGIN ONLY]
            └── sign-in/
```

**Structure Decision**: Web application structure using Next.js App Router conventions. Leveraging Route Groups (`(protected)`, `(public)`) for access control and shared layouts.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
