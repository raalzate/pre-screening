# Research: AI Rate Limiting Strategy

## Decision: Turso-Backed Persistent Rate Limiting

We will implement a persistent rate limiting mechanism using our existing Turso (LibSQL) database. The core logic will be encapsulated in a new `RateLimiter` service and integrated into the `BaseGenerator` class to protect all AI generation flows centrally.

### Rationale
- **Persistence Across Instances**: Since the app runs in a serverless/edge environment (Next.js), in-memory rate limiting would be inconsistent across different function invocations. Turso provides a shared state for rate limit counters.
- **Zero New Dependencies**: We already use `@libsql/client`, so we avoid adding external services like Upstash/Redis, reducing operational complexity and cost.
- **Centralized Protection**: Integrating into `BaseGenerator.generate()` ensures that EVERY AI feature (Benchmarking, Form Analysis, Rejection Feedback, etc.) automatically inherits the protection without needing manual route-by-route configuration.
- **Fail-Closed Compliance**: Database-backed checks allow us to explicitly handle connection failures by blocking requests, fulfilling the security requirement.

### Alternatives Considered

1. **Next.js `middleware.ts`**:
   - *Pros*: Early rejection before reaching the route.
   - *Cons*: Cannot easily access `getServerSession` (which requires headers availability) in a clean way without significant overhead. Harder to implement per-user persistent counters without an external store.
2. **Upstash/Ratelimit (Redis)**:
   - *Pros*: Extremely fast, purpose-built.
   - *Cons*: Introduces a new third-party dependency and potential cost. Turso is already sufficient for our scale (5 req/min).

### Technical Details
- **Schema**: A new table `ai_rate_limits` with `user_id` (PK), `request_count`, and `window_start`.
- **Threshold**: 5 requests per 60 seconds (Sliding or Fixed window).
- **Enforcement**:
  1. Check if user is authenticated (via `auth()` in Next.js).
  2. Query `ai_rate_limits` for the current window.
  3. Increment if under limit; throw 429 if over.
  4. Global protection in `BaseGenerator`.

### Resolved Unknowns
- **How to handle unauthenticated users?** Deny access entirely (as per clarification).
- **How to handle fail-safe?** Fail-closed; if DB is down, AI is inaccessible.
- **Where to inject?** `lib/ia/baseGenerator.ts`.
