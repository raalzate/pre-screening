# Research: Admin AI Form Analysis

## Decisions

### 1. AI Generation Pattern
- **Decision**: Use the `BaseGenerator` pattern with a new `FormAnalysisGenerator` in `lib/ia/`.
- **Rationale**: Consistency with existing AI features like `CertificationAnalysisGenerator`. It provides a structured way to define prompts and handle LLM responses.
- **Alternatives Considered**: Direct call to OpenAI/Gemini API from the route. Rejected to maintain project architectural standards.

### 2. API Endpoint
- **Decision**: Create `app/api/admin/forms/analysis/route.ts`.
- **Rationale**: Admin-specific functionality should reside under `/api/admin`. This route will handle authentication and delegate to the generator.

### 3. Caching Mechanism
- **Decision**: Use `localStorage` on the client-side with a timestamp.
- **Rationale**: Simple to implement, persists across page reloads (unlike React state), and meets the 1-day requirement.
- **Alternatives Considered**: Redis/Database caching. Rejected as overkill for this specific use case and user preference for "browser cache".

### 4. UI Integration
- **Decision**: Add the button and modal logic directly to `FormPreview.tsx`.
- **Rationale**: Minimal complexity. The button belongs in the results view of the preview. Use the existing `Modal` and `Spinner` components.

## Best Practices

- **Genkit**: Use structured output if possible to ensure the UI can parse specific sections (though for this feature, a single Markdown string is requested).
- **TypeScript**: Define interfaces for the `FormResult` to ensure type safety between the frontend and the AI service.
- **Security**: Ensure the API route is protected by `getServerSession` and checks for the `admin` role (if applicable, current implementation just checks for a valid session).

## Verification Plan

- **Manual**:
  1. Open a form preview.
  2. Answer all questions.
  3. Click "Analizar con IA".
  4. Verify the modal appears with a loading state.
  5. Verify the analysis content is displayed correctly in Markdown.
  6. Refresh the page and verify the results are retrieved from `localStorage` without a new API call.
