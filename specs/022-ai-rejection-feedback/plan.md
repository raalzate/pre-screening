# Implementation Plan: AI Rejection Feedback

**Branch**: `022-ai-rejection-feedback` | **Date**: 2026-02-18 | **Spec**: [spec.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/022-ai-rejection-feedback/spec.md)

## Summary

Implement a new `RejectionFeedbackGenerator` using Genkit to provide personalized mentoring feedback when a candidate is rejected during the pre-screening phase. This replaces the hardcoded fallback message with specific recommendations based on the candidate's skill gaps and the requirement profile.

## Technical Context

**Language/Version**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: `@genkit-ai/googleai`, `genkit`, `zod`, `@libsql/client` (Turso)
**Storage**: Turso (SQLite/LibSQL)
**Testing**: `npm test`
**Target Platform**: Vercel / Next.js
**Project Type**: Web Application
**Performance Goals**: AI generation < 3s; consistent tone.
**Constraints**: Background processing via `waitUntil`.
**Scale/Scope**: Affects the evaluation result for all rejected candidates.

## Constitution Check

| Gate | Status | Justification |
|------|--------|---------------|
| Architecture First | PASS | Spec and Plan completed before implementation. |
| Type Safety | PASS | Using Zod for I/O validation and strict TypeScript. |
| AI-Driven | PASS | Extending the existing Genkit `BaseGenerator` pattern. |
| Tessl Alignment | PASS | Using existing project dependencies. |
| Security | PASS | Environment variables handled via `config.ts`. |

## Project Structure

### Documentation (this feature)

```text
specs/022-ai-rejection-feedback/
├── plan.md              # This file
├── research.md          # Phase 0: Integration logic
├── data-model.md        # Phase 1: AI Result schema
├── quickstart.md        # Phase 1: Verification guide
├── contracts/           # Phase 1: API Changes
│   └── rejection.md     # SIDE EFFECT: /api/evaluation
└── tasks.md             # Phase 2 (Pending generation)
```

### Source Code

```text
app/api/evaluation/
└── route.ts            # Integrate new generator in rejection flow

lib/ia/
├── rejectionFeedbackGenerator.ts  # [NEW] Mentoring AI logic
└── baseGenerator.ts               # Existing base class
```

**Structure Decision**: Web application structure. Centralized AI logic in `lib/ia/` and integration in the evaluation API route.

## Verification Plan

### Automated Tests
-   Verify Zod schemas in `rejectionFeedbackGenerator.ts`.
-   Run `npm run lint` and `npm test`.

### Manual Verification
1.  Complete an evaluation resulting in rejection.
2.  Check the "Feedback" section on the candidate dashboard.
3.  Verify the content is professional, mentions actual skills, and uses markdown formatting.
