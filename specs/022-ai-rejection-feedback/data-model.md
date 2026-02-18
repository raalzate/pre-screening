# Data Model: AI Rejection Feedback

This feature utilizes existing database structures to store and display AI-generated feedback.

## Entities

### AI Recommendation
Represents the personalized mentoring feedback for a rejected candidate.

| Field | Type | Description |
|-------|------|-------------|
| feedback_text | TEXT | Markdown formatted mentoring advice. |
| generated_at | TEXT | Timestamp of generation. |

## Integration with Existing Models

-   **User (Candidate)**: The `interview_feedback` column in the `users` table will store the `feedback_text`.
-   **EvaluationResult**: The `analysis` or `mentoring` section will be part of the `evaluation_result` JSON object for historical tracking.

## Validation Rules

1.  **Input Verification**: AI generation only occurs if `coverageScore < 0.6` (as per current system logic).
2.  **Schema Enforcement**: Zod schema for input (Requirement context + Gaps) and output (mentoring advice string).
