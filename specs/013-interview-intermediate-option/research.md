# Research: Intermediate Option in Interview Wizard

**Feature**: `013-interview-intermediate-option`
**Status**: Complete

## Technical Context

The `InterviewWizard` component in `app/(public)/admin/page.tsx` currently handles decisions via a boolean `correct` argument in `handleDecision(correct: boolean)`.

- `correct: true` (Satisfactorio) -> Records "Correcto", advances to next question.
- `correct: false` (No Sabe) -> Records "Incorrecto", skips the rest of the section and moves to the next topic.

## Decisions

### 1. Update Decision Logic

- **Decision**: Change `handleDecision` to accept a union type: `'correct' | 'incorrect' | 'intermediate'`.
- **Rationale**: Boolean is no longer sufficient.
- **Logic for Intermediate**:
  - Record result as "Intermedio" (or "Parcial").
  - Behavior: Advance to the next question (same navigation logic as "Correcto").
  - **Why**: The user specified "esta deberia dejar continuar" (this should let you continue), enabling partial credit without skipping the topic.

### 2. UI Changes

- **Decision**: Add a third button in the Wizard footer.
- **Label**: "Intermedio / Parcial"
- **Style**: Yellow/Warning color scheme (between Red and Green).
- **Icon**: ⚠️ or 🟡.

## Alternatives Considered

- **Score Value**: The actual score calculation happens in the backend or is just recorded as a string string in the `history` array. The spec says "50% value".
  - *Verification*: The backend `api/challenge/interview-feedback` likely processes this history. I should ensure the string "Intermedio" is handled there or if it just feeds an LLM.
  - *Observation*: The `handleInterviewSave` sends `history` to `/api/challenge/interview-feedback`. This likely uses an LLM to generate the final text.
  - *Risk*: If the LLM prompt doesn't understand "Intermedio", it might halluncinate. I should check the prompt if possible, or just rely on the LLM's semantic understanding that "Intermedio" means partial success. Given it's "AI Context", it should handle it fine.

## Unknowns & Clarifications

- **Backend Prompt**: Does the backend prompt explicitely handle "Correcto"/"Incorrecto"?
  - *Action*: I will check `app/api/challenge/interview-feedback/route.ts` if accessible. If not, I'll assume standard Spanish text is fine.
  - *Update*: I'll verify the backend route in the implementation plan phase.
