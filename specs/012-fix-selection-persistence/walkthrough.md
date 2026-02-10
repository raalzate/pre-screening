# Walkthrough - Verify Fix for Selection Persistence

The fix ensures that when you switch between the "Candidatos" (Active), "Historial" (History), and "Formularios" (Forms) tabs in the Admin Dashboard, any currently selected candidate is cleared. This prevents candidate details from "bleeding" into the view of another list.

## Verification Steps

1.  **Open the Admin Dashboard** at `/admin`.
2.  **Select a Candidate** in the "Candidatos" tab.
    - Confirm the details panel appears below.
3.  **Switch to the "Historial" tab**.
    - **Observe**: The candidate details panel should disappear immediately.
    - **Observe**: The selection dropdown (if visible in shared header) or context should reset.
4.  **Switch back to "Candidatos"**.
    - **Observe**: No candidate should be selected (state is clean).

## Changes Made

- Modified `app/(public)/admin/page.tsx` to explicitly reset `selectedCode` and `userData` when clicking view toggle buttons.
