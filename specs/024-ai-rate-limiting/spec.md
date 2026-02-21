# Feature Specification: AI Rate Limiting

**Feature Branch**: `024-ai-rate-limiting`
**Created**: 2026-02-19
**Status**: Draft
**Input**: User description: "crear un rate limit para todos los pedidos de la IA, garantiza una tasa para evitar abusos"

## Clarifications

### Session 2026-02-19
- Q: How should the system handle AI requests from unauthenticated users? → A: Deny AI requests for unauthenticated users entirely.
- Q: What happens if the internal rate limiting service (e.g., memory or Redis) fails? → A: Fail-closed: Reject all AI requests with a "Service temporarily unavailable" error.


## User Scenarios & Testing *(mandatory)*

### User Story 1 - Protection against automated abuse (Priority: P1)

As a system owner, I want to limit the frequency of AI requests from a single user or session to prevent automated scripts or malicious users from exhausting the API quota or incurring excessive costs.

**Why this priority**: Essential for cost control and system stability. AI API costs are significant, and quotas are limited.

**Independent Test**: Can be tested by simulating 50 AI requests in 1 minute from a single user and verifying that the system starts rejecting requests after the threshold is reached.

**Acceptance Scenarios**:

1. **Given** a user has exceeded the allowed rate of 10 requests per minute, **When** they attempt an 11th request, **Then** the system MUST reject the request with a "Rate limit exceeded" message.
2. **Given** a user is within the allowed rate, **When** they make a request, **Then** the system MUST process the request normally.

---

### User Story 2 - User notification and retry guidance (Priority: P2)

As a candidate or administrator, I want to receive clear feedback when I hit a rate limit so that I understand why the feature is temporarily unavailable and when I can try again.

**Why this priority**: Improves user experience by providing transparency instead of generic failures.

**Independent Test**: Trigger a rate limit error in the UI and verify that a user-friendly message is displayed.

**Acceptance Scenarios**:

1. **Given** a user hits the rate limit, **When** the error is returned, **Then** the UI MUST show a message like "Has superado el límite de peticiones. Por favor, espera un momento antes de reintentar."

---

### User Story 3 - Global AI Coverage (Priority: P1)

As a developer, I want the rate limit to be applied globally across all AI-related endpoints (Benchmark Generation, Form Analysis, Evaluation Feedback) so that no endpoint is left unprotected.

**Why this priority**: A single unprotected endpoint can be used to bypass the entire protection scheme.

**Independent Test**: Verify that rate limiting triggers on at least three different AI features (e.g., Studio Benchmark, Rejection Feedback, Evaluation Analysis).

**Acceptance Scenarios**:

1. **Given** multiple AI-powered features exist, **When** any of them is invoked, **Then** the request MUST be counted against the same user's rate limit.

---

### Edge Cases

- **What happens when a user is not authenticated?** AI requests MUST be blocked for unauthenticated users to prevent anonymous exploitation.
- **How does the system handle rapid-fire clicks on a "Generate" button?** The UI should disable the button after the first click, but the server-side rate limit should catch any attempts that bypass the UI (e.g., direct API calls).
- **What happens if the internal rate limiting service (e.g., memory or Redis) fails?** The system MUST fail-closed, rejecting requests to ensure costs are controlled during outages of the tracking mechanism.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST implement a request counter per user (based on User ID or Session ID).
- **FR-002**: System MUST enforce a default rate limit (e.g., 5 requests per minute per user).
- **FR-003**: System MUST deny all AI-related requests if a valid user session is not present.
- **FR-004**: System MUST identify the current user using authenticated session data before processing any AI request.
- **FR-005**: System MUST apply the rate limit middleware/logic to all `/api/*/generate/*` and `/api/*/analyze/*` endpoints.
- **FR-006**: System MUST return an HTTP 429 (Too Many Requests) status code when the limit is reached.
- **FR-007**: System MUST return an HTTP 503 (Service Unavailable) or 500 (Internal Server Error) if the rate limiting service fails.
- **FR-008**: Rate limit window MUST be reset automatically after the specified duration (e.g., 1 minute).

### Key Entities

- **AIRateLimitBucket**: Represents the tracking of requests for a specific user within a time window.
    - `key`: Identifier (UserID/IP)
    - `count`: Number of requests made
    - `resetTime`: When the current window expires

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: System blocks 100% of requests exceeding the configured threshold (e.g., 6th request in a 5-request/min window).
- **SC-002**: Average overhead of checking the rate limit MUST be under 10ms per request.
- **SC-003**: 0% of AI requests bypass the rate limiting logic across all identified AI endpoints.
