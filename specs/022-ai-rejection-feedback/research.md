# Research: AI Rejection Feedback

## Integration via Genkit

I have identified that the project uses a standardized AI generation pattern via the `BaseGenerator` class in `lib/ia/baseGenerator.ts`.

### Findings

1.  **AI Patterns**: Existing features like `EvaluationGenerator` and `InterviewFeedbackGenerator` follow a structured request/response flow with Zod validation.
2.  **Trigger Point**: The evaluation rejection happens in `app/api/evaluation/route.ts` within a `waitUntil` block.
3.  **Data Available**: At the point of rejection, we have:
    -   Candidate's self-declared `answers`.
    -   `requirements` (title and specific skill levels).
    -   `comparisonResult.gaps` (showing exactly where they fell short).
4.  **Tone & Mentoring**: The user explicitly requested a "friendly" and "mentoring" tone to help candidates improve.

### Decisions

-   **New Generator**: Create `RejectionFeedbackGenerator` extending `BaseGenerator`.
-   **Prompt Strategy**: Provide the requirement profile and the specific gaps to the AI, instructing it to act as a mentor giving constructive advice.
-   **Storage**: Store the result in the `interview_feedback` column of the `users` table, which is already used to display feedback on the candidate's dashboard.

## Alternatives Considered

-   **Static Feedback**: Rejected because it wouldn't fulfill the "personalized recommendations" requirement.
-   **On-the-fly Generation in API**: Rejected in favor of the `BaseGenerator` class to maintain consistency with the rest of the project's AI architecture.
