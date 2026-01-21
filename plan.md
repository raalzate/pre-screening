# Implementation Plan: Project Improvements and Tessl Alignment

## Architecture
- **Config Service**: `lib/config.ts` using Zod.
- **AI Base**: `lib/ia/baseGenerator.ts` using Genkit.
- **Generators**: Concrete classes in `lib/ia/` extending `BaseGenerator`.

## Phases

### Phase 1: Foundation
- Create `config.ts`.
- Create `baseGenerator.ts`.
- Update `package.json` metadata.

### Phase 2: Refactoring
- Refactor `evaluationGenerator.ts`.
- Refactor `challengeGenerator.ts`.
- Refactor other generators.
- Update `db.ts` and `auth.ts` to use `config.ts`.

### Phase 3: Tessl Alignment
- Update `tessl.json` dependencies and name.

### Phase 4: Verification
- Lint and Build checks.
