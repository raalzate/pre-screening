# Feature Specification: Candidate History Migration

**Feature Branch**: `003-move-user-to-history`  
**Created**: 2026-01-26  
**Status**: Draft  
**Input**: User description: "al finalizar el flujo (entregar el feedback del reto) mover el registro del usuario a otra tabla (historico de candidatos), es decir elimina el registro de users y lo inserta en history"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Archive Candidate after Feedback (Priority: P1)

As an administrator, once I have submitted the final interview feedback for a candidate, I want their record to be automatically moved to a history table and removed from the active users list to keep the management view clean.

**Why this priority**: Core requirement. It ensures the administrative panel only shows candidates currently in process, while preserving data for historical analysis.

**Independent Test**: Submit feedback for a candidate and verify their code no longer appears in the active candidates list but is present in the history table.

**Acceptance Scenarios**:

1. **Given** a candidate exists in the `users` table, **When** the admin submits interview feedback via the API, **Then** the candidate's data is copied to the `history_candidates` table.
2. **Given** a candidate's data has been successfully copied to `history_candidates`, **When** the transaction concludes, **Then** the candidate is deleted from the `users` table.
3. **Given** the move operation is in progress, **When** any database error occurs during insertion to history, **Then** the original record MUST remain in the `users` table (transaction rollback).

### Edge Cases

- **Concurrent submissions**: What happens if two admins try to submit feedback at the exact same moment for the same candidate? (Database row locking or unique constraint on `code` in history).
- **Schema mismatch**: How does the system handle a move if the `users` table has been updated but the `history_candidates` table hasn't? (Schema sync or robust insert logic).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST create a `history_candidates` table if it doesn't exist.
- **FR-002**: The `history_candidates` table MUST have all columns from the `users` table plus a `moved_at` timestamp.
- **FR-003**: System MUST move the candidate record from `users` to `history_candidates` within the `/api/user/feedback` POST endpoint execution.
- **FR-004**: The move operation MUST be atomic (all-or-nothing transaction).
- **FR-005**: System MUST preserve all existing candidate data, including JSON-serialized fields like `evaluation_result` and `challenge_result`.

### Key Entities

- **Active Candidate**: A user currently participating in the pre-screening process.
- **Archived Candidate**: A historical record of a candidate who has completed the process.
  - Attributes: All from `users` + `moved_at` (timestamp).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of candidates with submitted feedback are correctly archived.
- **SC-002**: The administrative board only displays candidates with "active" steps (not in history).
- **SC-003**: Data integrity is maintained with zero orphaned records in `users` after a successful move.
- **SC-004**: Archiving process adds less than 200ms of additional latency to the feedback submission API.
