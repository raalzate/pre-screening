# Quickstart: AI Rejection Feedback

## Integration Flow

1.  A candidate completes the pre-screening form.
2.  `POST /api/evaluation` is called.
3.  The system determines the candidate does not meet the 60% coverage threshold.
4.  The system invokes the AI mentor in the background (`waitUntil`).
5.  The AI generates personalized mentoring advice.
6.  The candidate's dashboard is updated with the new feedback.

## Verification

To verify the mentoring tone:
1.  Complete an evaluation with very low scores for a specific role.
2.  Wait a few seconds for background processing.
3.  View the "Feedback" section on the candidate dashboard.
4.  Confirm the advice mentions the specific skills where you scored 0.
