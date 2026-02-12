# Implementation Plan: Secure Certification Question Validation

**Branch**: `015-secure-cert-questions` | **Date**: 2026-02-12 | **Spec**: [spec.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/015-secure-cert-questions/spec.md)
**Input**: Feature specification from `/specs/015-secure-cert-questions/spec.md`

## Summary

The goal is to secure the certification process by moving the answer validation from the frontend to the backend. Currently, the frontend receives the correct answers along with the questions, allowing potential leakage and cheating. The technical approach involves:
1. Updating the `GET /api/certification` endpoint to strip correct answers and rationales.
2. Updating the `POST /api/certification` endpoint to receive only the user's answers and perform the validation/scoring on the server.
3. Modifying `DynamicMCQForm` to remove validation logic and handle the server-side filtered response.

## Technical Context

**Language/Version**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: `@libsql/client` (Turso), `next-auth`
**Storage**: Turso (LibSQL / SQLite)
**Testing**: Manual verification + Playwright for automated UI security checks
**Target Platform**: Web (Next.js)
**Project Type**: Web application
**Performance Goals**: API response time < 200ms for validation
**Constraints**: Zero correct answers leaked in initial question load
**Scale/Scope**: Certification module in the prescreening app

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Architecture First**: PASSED - `spec.md` and `plan.md` are defined before implementation.
2. **Type Safety**: PASSED - Using TypeScript with strict checks.
3. **AI-Driven**: PASSED - Standard patterns followed (though this feature is security-focused).
4. **Tessl Alignment**: PASSED - `tessl.json` is maintained.
5. **Security**: PASSED - Directly addresses a security vulnerability by enforcing server-side validation.

## Project Structure

### Documentation (this feature)

```text
specs/015-secure-cert-questions/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
app/
└── api/
    └── certification/
        └── route.ts     # [MODIFY] Strip answers in GET, validate in POST

components/
└── DynamicMCQForm.tsx   # [MODIFY] Remove local validation logic

lib/
└── ia/
    └── certification.ts # [NEW] Server-side validation logic (if needed to extract)
```

**Structure Decision**: Single project structure following the existing Next.js App Router patterns.
## Verification Plan

### Automated Tests
- **API Security Validation**: Create a script `scripts/verify-cert-security.sh` to fetch the certification questions and verify the absence of `correctAnswer` and `rationale` fields.
  ```bash
  # Command to run (after implementing)
  ./scripts/verify-cert-security.sh
  ```
- **Integrity Test**: Use `curl` to send only answers to `POST /api/certification` and verify the server returns a correctly calculated result object.

### Manual Verification
1. **Developer Tools Check**:
   - Log in as a candidate.
   - Navigate to the certification page.
   - Open Chrome DevTools > Network tab.
   - Click on the `certification` GET request.
   - **Expected**: No `correctAnswer` or `rationale` fields in the JSON response.
2. **End-to-End Flow**:
   - Complete the certification honestly.
   - Click "Enviar Respuestas".
   - **Expected**: The results screen appears with correct score and explanations (now fetched from the server).
3. **Cheating Attempt**:
   - Try to manually find answers in the source code or local storage.
   - **Expected**: Answers are not found.

## Complexity Tracking

> **No violations found.**
