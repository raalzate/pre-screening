# Walkthrough - Verify Feedback Flow & Search Fix

This guide covers the verification of the refined feedback flow (splitting multi-profile candidates) and the candidate search fix.

## Verification Steps

### 1. Verify "User not found" Fix

1.  **Go to Admin Dashboard** (`/admin`).
2.  **Search**: Try searching for a candidate by code, but **add spaces** at the end (e.g., `12345 `).
    - **Expected**: The system should find the candidate despite the whitespace.
    - **Previous Behavior**: "Usuario no encontrado".

### 2. Verify Refined Feedback Flow

1.  **Identify Multi-Profile Candidate**: Find a candidate with multiple requirements (e.g., `Req A, Req B`).
    - *Tip*: You can create one via `curl` or by editing the DB if needed, or use an existing one.
2.  **Go to Interview Assistant** -> **Evaluación del Entrevistador**.
3.  **Check Selector**:
    - **Observe**: A yellow warning box should appear with a dropdown to select the specific profile (e.g., "Req A" or "Req B").
4.  **Submit Feedback**:
    - Select "Req A".
    - Fill out feedback and status (e.g., "Pasa").
    - Click **"Guardar y Archivar"**.
5.  **Verify Result**:
    - **Active List**: The candidate should remain active but only with `Req B` listed.
    - **History Tab**: A new entry for `Req A` should appear with the feedback.

## Changes Made

- **API (`api/user`)**: Added trimming to `code` and `requirements` query params.
- **Frontend (`page.tsx`)**: Added trimming to search inputs and `fetchCandidate` calls.
- **Feedback UI**: Added logic to detect multiple requirements and show a selector in `InterviewFeedbackCard`.
- **Feedback API**: Implemented logic to split requirements:
  - Moves the *selected* requirement to `history_candidates`.
  - Updates the `users` table to remove the selected requirement (keeping others active).
