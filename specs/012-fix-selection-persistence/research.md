# Research: Fix Selection Persistence in Admin Tabs

**Feature**: `012-fix-selection-persistence`
**Status**: Complete

## Technical Context

The Admin Dashboard (`app/(public)/admin/page.tsx`) uses local React state to manage the active view (`candidates`, `history`, `forms`) and the selected candidate (`selectedCode`, `userData`).

Currently, switching the `view` does not reset `selectedCode` or `userData`. This causes the candidate details panel to remain visible even when switching to a context where it shouldn't be (e.g., History).

## Decisions

### State Management

- **Decision**: Clear `selectedCode` and `userData` explicitly when switching views.
- **Rationale**: This ensures the UI reflects the "empty" selection state expected when entering a new tab.
- **Implementation**:
  - Update `onClick` handlers for the View Toggle buttons.
  - Invoke `setSelectedCode("")`.
  - Invoke `setData(null)` (destructured from `useCandidate` hook).

## Alternatives Considered

- **useEffect**: Listening to `view` changes in a `useEffect` to clear state.
  - *Pros*: Centralized logic.
  - *Cons*: Might trigger unnecessary re-renders or conflicts if we eventually want to preserve state (though typically we don't for this use case, explicit action is often cleaner for UI interactions). Explicit handlers are preferred for user-initiated actions.

## Unknowns & Clarifications

- None. The code path is clear.
