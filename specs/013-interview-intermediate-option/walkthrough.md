# Walkthrough - Verify Intermediate Option in Interview Wizard

The "Intermedio / Parcial" option has been added to the Interview Wizard. This allows recording partial success without skipping the entire topic.

## Verification Steps

1.  **Open the Admin Dashboard** at `/admin`.
2.  **Select a Candidate** and click **"Modo Guía (Wizard)"** in the Interview Assistant card.
3.  **Navigate to a Question**.
4.  **Click "Intermedio / Parcial"** (Yellow button with ⚠️ icon).
    - **Observe**: The wizard should advance to the **next question** (not the next section).
5.  **Complete the Interview**.
6.  **Generate Feedback**.
    - **Observe**: The AI feedback should reflect partial knowledge in the topics where "Intermedio" was selected.

## Changes Made

- **Frontend**: Added "Intermedio" button to `InterviewWizard`. Updated logic to treat "Intermedio" as a non-failing state (advances to next question).
- **Backend/AI**: Updated `interviewFeedbackGenerator` prompt to recognize "Intermedio" status.
