# Data Model: Admin AI Form Analysis

## Entities

### FormSelectionResult
Represents the input data for the AI analysis, derived from the `FormPreview` state.

| Field | Type | Description |
|-------|------|-------------|
| formId | string | Unique identifier of the form template |
| title | string | Title of the form |
| answers | Record<string, number> | Map of question IDs to selected scores |
| resultData | object | Calculated scores and improvements from `FormPreview` |

### CachedAnalysis
Represents the AI analysis stored in `localStorage`.

| Field | Type | Description |
|-------|------|-------------|
| analysis | string | The generated Markdown content from the AI |
| timestamp | number | Unix timestamp of when the analysis was generated |
| cacheKey | string | Unique key combining formId and hash of answers |

## State Transitions

1. **Idle**: User has not requested AI analysis.
2. **Generating**: AI request is in flight.
3. **Displaying**: Analysis is visible in the modal.
4. **Cached**: Analysis is retrieved from `localStorage` on subsequent requests within 24 hours.
