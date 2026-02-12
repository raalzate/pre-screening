# Research: Secure Certification Questions

## Decision: Server-Side Validation and Data Stripping

We will move all validation logic from the frontend to the backend and ensure that sensitive fields (`correctAnswer`, `rationale`) are stripped from the question data sent to the client.

### Rationale
- **Security**: Prevent candidates from finding answers in the browser's developer tools.
- **Integrity**: Ensure the certification results are calculated by the system, not trust the client's provided score.
- **User Experience**: Maintain the same post-submission feedback (explanations for wrong answers) while keeping it secure.

### Alternatives Considered
- **Frontend Obfuscation**: Base64 encoding or simple hashing in the frontend. **Rejected** because it only deters casual users and is not truly secure.
- **One Question at a Time**: Delivering one question, validating it, then sending the next. **Rejected** as it complicates the UX significantly and requires more API roundtrips, while stripping fields achieves the same security goal for the whole set.

### Implementation Details
- **Data Transformation**: Use a mapping function in the `GET` endpoint to remove `correctAnswer` and `rationale`.
- **Validation Utility**: Create a function that iterates through the user's answers, compares them with the stored questions in the DB, and calculates the score.
- **Analysis Generation**: The text analysis (highlighting weak areas) will also be generated on the server.
