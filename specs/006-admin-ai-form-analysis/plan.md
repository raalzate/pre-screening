# Implementation Plan: Admin AI Form Analysis

Implement an AI-driven analysis for form results in the admin dashboard. This will allow administrators to get a high-level summary of candidate strengths and weaknesses after completing a form preview.

## Proposed Changes

### AI Infrastructure

#### [NEW] [formAnalysisGenerator.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/lib/ia/formAnalysisGenerator.ts)
- Create a new Genkit-based generator `FormAnalysisGenerator`.
- Define `FormAnalysisInputSchema` to match the API contract (formId, title, answers, resultData).
- Implement the prompt template to focus on:
    - Overall performance diagnosis.
    - Top critical gaps.
    - Actionable technical next steps.

#### [NEW] [route.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/app/api/admin/forms/analysis/route.ts)
- Create a POST endpoint that:
    - Verifies the user's session using `getServerSession`.
    - Validates the incoming request body.
    - Calls the `formAnalysisGenerator.generate()` method.
    - Returns the Markdown formatted analysis string.

### UI Components

#### [MODIFY] [FormPreview.tsx](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/components/admin/FormPreview.tsx)
- State additions: `analysis`, `isAnalyzing`, `showAnalysisModal`.
- Add an "Analizar con IA" button in the `resultData` view.
- Implement `handleAnalyze()`:
    - Check `localStorage` for existing analysis (TTL: 24h).
    - If not cached, call the analysis API.
    - Save result to `localStorage`.
- Add a modal or card to display the Markdown output from the AI.

---

## Verification Plan

### Automated Tests
- Run `npm run lint` to verify syntax and type safety.

### Manual Verification
1. **Full Analysis Flow**:
    - Open the admin dashboard.
    - Select a form and complete the preview.
    - Click "Analizar con IA".
    - Verify that a loading spinner appears.
    - Verify that the AI analysis is displayed in a readable format.
2. **Caching Logic**:
    - Refresh the results page.
    - Click "Analizar con IA" again.
    - Verify that the analysis appears instantly (check DevTools Network tab - it should NOT make a new request).
3. **Error Handling**:
    - Mock a failed API response (e.g., by temporarily changing the API URL).
    - Verify that a friendly error message is shown to the user.
