# Implementation Plan - Intermediate Option in Interview Wizard

This plan implements a third "Intermediate" (Intermedio) option in the Interview Wizard to allow interviewers to record partial success without skipping the topic.

## User Review Required

> [!NOTE]
> The "Intermediate" option will advance to the next question (similar to "Satisfactorio"). It will be recorded as "Intermedio" in the history.
> The AI Feedback generator prompt will be updated to recognize "Intermedio" as a partial success.

## Proposed Changes

### Frontend

#### [MODIFY] [page.tsx](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/app/(public)/admin/page.tsx)

- Update `handleDecision` signature to accept a string value (`'correct' | 'incorrect' | 'intermediate'`) instead of a boolean.
- Update logic inside `handleDecision`:
  - `'intermediate'`: Record result as "Intermedio". Advance to next question (same navigation flow as `'correct'`).
- Add a third button in the Wizard footer:
  - Label: "Intermedio / Parcial" (Yellow/Warning style).
  - Value: Trigger `handleDecision('intermediate')`.

### Backend / AI

#### [MODIFY] [interviewFeedbackGenerator.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/lib/ia/interviewFeedbackGenerator.ts)

- Update the prompt template to explicitly mention "Intermedio" as a possible result.
- Explanation: "Intermedio" means the candidate had partial knowledge or needed guidance but didn't completely fail.

## Verification Plan

### Manual Verification

1.  **Open Interview Wizard**: Start an interview session.
2.  **Test "Intermedio"**: Click the "Intermedio" button on a question.
    - *Verify*: The wizard advances to the **next question** in the same section (does not skip section).
3.  **Complete Interview**: Finish all sections.
4.  **Check Feedback**: View the AI-generated feedback.
    - *Verify*: The feedback mentions partial knowledge or intermediate performance for that specific topic.
5.  **Check History**: Verify the "Intermedio" status is recorded in the history log (if visible).
