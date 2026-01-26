# Implementation Plan: Admin View Forms

**Branch**: `002-admin-view-forms` | **Date**: 2026-01-23 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-admin-view-forms/spec.md`

## Summary
The goal is to provide administrators with a read-only view of the pre-screening form templates. This will be achieved by creating dedicated administrative API endpoints to list and retrieve form definitions, and adding a new "Formularios" view to the existing Admin dashboard.

## Technical Context

**Language/Version**: TypeScript / Next.js (App Router)
**Primary Dependencies**: React, Tailwind CSS
**Storage**: files (JSON in `data/forms/`)
**Testing**: Manual walkthrough
**Target Platform**: Web (Admin Portal)
**Project Type**: Web application
**Performance Goals**: Form detail view loads in under 1 second
**Constraints**: Read-only access, no form modification allowed
**Scale/Scope**: Initial release covers all existing pre-screening form templates

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Architecture First**: Spec and Plan created before any code changes.
- [x] **Type Safety**: New components and API routes will use strict TypeScript.
- [x] **AI-Driven**: N/A for this UI-focused feature.
- [x] **Tessl Alignment**: No new dependencies assigned to `tessl.json`.
- [x] **Security**: Uses `getServerSession` for API protection; no direct env exposure.

## Project Structure

### Documentation (this feature)

```text
specs/002-admin-view-forms/
├── plan.md              # This file
├── research.md          # Decision log
├── data-model.md        # Form structure documentation
├── quickstart.md        # Feature overview
├── contracts/           # API contract definitions
└── tasks.md             # To be created by /speckit.tasks
```

### Source Code (repository root)

```text
app/
├── (public)/
│   └── admin/
│       └── page.tsx      # Main admin page (updated with view toggle)
└── api/
    └── admin/
        └── forms/
            ├── route.ts          # List forms API
            └── [id]/
                └── route.ts      # Form detail API
components/
└── admin/
    ├── AdminFormsView.tsx        # Container for the forms section
    └── FormPreview.tsx           # Read-only form renderer
```

**Structure Decision**: Integrated within the existing Admin module. New components are placed in a dedicated `admin` directory within `components` to keep the codebase organized.
