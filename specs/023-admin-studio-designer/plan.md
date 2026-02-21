# Implementation Plan: Admin Studio Designer

**Branch**: `023-admin-studio-designer` | **Date**: 2026-02-18 | **Spec**: [spec.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/023-admin-studio-designer/spec.md)
**Input**: Feature specification from `/specs/023-admin-studio-designer/spec.md`

## Summary

The Admin Studio Designer allows administrators to create and manage requirement profiles and evaluation forms. 
These configurations will be stored in a Turso database as full JSON objects with metadata for filtering. 
The system will leverage Genkit to generate these JSONs based on a standard set of descriptors located in `data/descriptors.json`.

## Technical Context

**Language/Version**: TypeScript / Next.js 15 (App Router) + React 19  
**Primary Dependencies**: `@libsql/client` (Turso), `genkit`, `@genkit-ai/googleai`, `zod`, `react-markdown`  
**Storage**: Turso (SQLite/LibSQL) - Two new tables: `studio_requirements` and `studio_forms`.  
**Testing**: `npm test` && `npm run lint`  
**Target Platform**: Vercel / Web Browser
**Project Type**: Web application
**Performance Goals**: AI JSON generation < 10s; Dashboard listing < 1s.  
**Constraints**: Must use `data/descriptors.json` for all skill mappings.  
**Scale/Scope**: Admin-facing tool for managing recruitment configurations.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Architecture First**: [x] `spec.md` and `plan.md` defined before implementation.
- **Type Safety**: [x] TypeScript with strict null checks (via Zod).
- **AI-Driven**: [x] Leveraging Genkit with `BaseGenerator` pattern.
- **Tessl Alignment**: [x] Dependencies managed via `tessl.json`.
- **Security**: [x] Using `config.ts` for environment variables.

## Project Structure

### Documentation (this feature)

```text
specs/023-admin-studio-designer/
├── plan.md              # This file
├── research.md          # Database and AI integration research
├── data-model.md        # Database schema and Zod entities
├── quickstart.md        # Feature setup guide
├── contracts/           # API Contract definitions
│   └── studio.md        # Requirements and Forms API
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/ (or app/ in this project structure)
├── app/
│   ├── (protected)/
│   │   └── admin/
│   │       └── studio/
│   │           ├── page.tsx          # Studio Dashboard
│   │           ├── requirements/     # Requirement Designer UI
│   │           └── forms/            # Form Designer UI
│   └── api/
│       └── admin/
│           └── studio/
│               ├── requirements/     # API for requirements
│               └── forms/            # API for forms
├── lib/
│   ├── ia/
│   │   ├── studioRequirementGenerator.ts
│   │   └── studioFormGenerator.ts
│   └── db.ts                         # Table initialization
```

**Structure Decision**: The feature is integrated into the existing Next.js App Router structure under `app/(protected)/admin/studio`. UI components will be co-located or placed in `components/admin/studio` if they grow large.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
