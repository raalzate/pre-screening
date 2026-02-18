# API Contracts: AI Rejection Feedback

This feature modifies the side effect of the evaluation endpoint.

## [POST] /api/evaluation

Evaluates a candidate. If rejected, triggers AI feedback generation.

### Side Effect (Rejection)

When `valid` is `false`, the system now performs:

1.  **AI Generation**: Calls `rejectionFeedbackGenerator` with the candidate's gaps and requirement context.
2.  **Database Update**:
    ```sql
    UPDATE users 
    SET interview_feedback = <AI_GENERATED_FEEDBACK>
    WHERE code = ? AND requirements = ?
    ```

### Mock AI Response

```json
{
  "feedback": "### Recomendaciones para tu Crecimiento\n\nHola, gracias por tu interés. Notamos que tienes una base sólida en React, pero te recomendamos profundizar en:\n\n* **Gestión de Estado**: Explora Redux Toolkit para manejar estados complejos.\n* **Testing**: Aprende Jest y React Testing Library..."
}
```
