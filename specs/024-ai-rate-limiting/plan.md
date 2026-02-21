# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a persistent rate limiting mechanism to protect all AI generation features from abuse, enforcing a limit of **5 requests per minute per authenticated user**. Unauthenticated requests will be denied. The solution uses the existing Turso (LibSQL) infrastructure for tracking request counters across serverless instances, ensuring cost control and system stability with minimal overhead.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: `next-auth`, `zod`, `genkit`, `upstash/ratelimit` (candidate for Redis-backed RL) or simple in-memory LRU
**Storage**: Turso (SQLite/LibSQL) for persistent configs, Memory/Redis for transient RL buckets
**Testing**: `npm test` (Jest/Vitest implied)
**Target Platform**: Vercel / Next.js
**Project Type**: Web Application (App Router)
**Performance Goals**: <10ms overhead for rate-limit checks
**Constraints**: 5 requests/minute per authenticated user; fail-closed behavior
**Scale/Scope**: All AI-powered endpoints (Benchmark, Analysis, Feedback)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Architecture First**: Spec and Plan defined before implementation.
- [x] **Type Safety**: Using TypeScript for `RateLimiter` service.
- [x] **AI-Driven**: Integrated directly into `BaseGenerator` pattern as a cross-cutting concern.
- [x] **Security**: Uses session-based identification; environment variables protected via `config.ts`.
- [x] **Performance**: Overhead <10ms for DB-backed checks.

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
├── lib/
│   ├── ia/
│   │   ├── baseGenerator.ts    # Integration point for rate limiting
│   │   └── rateLimiter.ts      # [NEW] Core rate limiting logic & service
│   └── db.ts                   # Schema migration & helper functions
└── app/
    └── api/                    # All endpoints check for 429/401
```

**Structure Decision**: Centralized integration in `lib/ia/baseGenerator.ts` to ensure consistency and prevent bypasses. New service in `lib/ia/rateLimiter.ts`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

---

# Implementation Plan: AI Rate Limiting

Apply a global limit of 5 AI requests per minute per authenticated user to protect infrastructure and control costs.

## User Review Required

> [!IMPORTANT]
> Rate limiting is enforced globally at the `BaseGenerator` level. Authenticated users (admin/candidate) are identified by their `code` or `email`. Throttled requests will receive a `429 Too Many Requests` status with a user-friendly message.

## Proposed Changes

### [Database]
#### [MODIFY] [db.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/lib/db.ts)
- Add `ai_rate_limits` table: `user_id` (PK), `request_count`, `window_start`.
- Implement helper functions: `getAIRateLimit`, `upsertAIRateLimit`, `incrementAIRateLimit`.

### [AI Services]
#### [NEW] [rateLimiter.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/lib/ia/rateLimiter.ts)
- Implement `RateLimiter` class with sliding window logic.
#### [MODIFY] [baseGenerator.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/lib/ia/baseGenerator.ts)
- Integrate `RateLimiter` and `next-auth` checks into the `generate` pipeline.
- Define `RateLimitError` and `UnauthorizedError`.

### [API Routes]
#### [MODIFY] AI Routes (7 files)
- Update routes in `admin/studio/*`, `admin/forms/*`, `certification/*`, `challenge/*` to handle 429/401 errors.

## Verification Plan

### Automated Verification
- Run AI test script repeatedly (6+ times in < 1 min) to verify that the 6th request is rejected with a 429 status.

### Manual Verification
- Attempt to generate studio requirements 6 times quickly.
- Verify that a toast/alert appears with the message: "Has superado el límite de 5 peticiones por minuto..."
