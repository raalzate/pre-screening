# Implementation Plan - Fix Selection Persistence in Admin Tabs

This plan addresses the issue where a selected candidate's details remain visible when switching between tabs (e.g., from "Active Candidates" to "History") in the Admin Dashboard.

## User Review Required

> [!NOTE]
> This change will clear any selected candidate when switching tabs. If you navigate back to the previous tab, you will need to re-select the candidate. This is the intended behavior to prevent UI state "bleeding" across contexts.

## Proposed Changes

### Admin Dashboard

#### [MODIFY] [page.tsx](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/app/(public)/admin/page.tsx)

- Update the `onClick` handlers for the view toggle buttons ("Candidatos", "Historial", "Formularios").
- Ensure that when switching views:
  - `selectedCode` is reset to `""`.
  - `userData` (candidate details) is reset to `null` (using `setData` from `useCandidate`).
  - `selectedFormId` is already reset to `null`, ensuring consistency.

```typescript
// Example change logic
const resetSelection = () => {
    setSelectedCode("");
    setData(null); // Clears the detailed view
    setSelectedFormId(null);
};

// ... inside render:
<button onClick={() => { setView("candidates"); resetSelection(); }}>...</button>
<button onClick={() => { setView("history"); resetSelection(); }}>...</button>
<button onClick={() => { setView("forms"); resetSelection(); }}>...</button>
```

## Verification Plan

### Manual Verification

1.  **Pre-requisite**: Ensure you are logged in as an admin and have candidates in the "Active" and/or "History" lists.
2.  **Action**: Navigate to the "Candidatos" (Active Candidates) tab.
3.  **Action**: Select a candidate from the dropdown list.
    - *Verify*: The candidate details panel appears below.
4.  **Action**: Click on the "Historial" (History) tab.
    - *Verify*: The candidate details panel **disappears**.
    - *Verify*: The "History" list (or empty state/filters) is displayed without any residual candidate information.
5.  **Action**: Click back to the "Candidatos" tab.
    - *Verify*: The candidate selection dropdown is reset to "Select Candidate" (default state).
    - *Verify*: No candidate details are shown until a new selection is made.
