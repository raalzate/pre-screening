# Data Model: Secure Certification

## Overview

We are introducing a clear separation between the full `EvaluationResult` stored in the database and the sanitized data sent to the client.

## Entities

### CertificationResult (Database & API Response)
*Represents the full evaluation including answers.*
- `score`: number (count of correct answers)
- `total`: number (total questions)
- `analysis`: string (summary of performance/weak areas)
- `details`: Array of `ResultDetail`

### ResultDetail
*Detailed breakdown of a single question evaluation.*
- `questionId`: string
- `correct`: boolean
- `chosen`: string | null
- `correctAnswer`: string
- `rationale`: string
- `relatedTo`: string[]

### CertificationProfile (Client Data)
*Sanitized data sent to the frontend before submission.*
- `formId`: string
- `validityScore`: number
- `scoreExplanation`: string
- `questions`: Array of `SanitizedQuestion`

### SanitizedQuestion
*Question without the answer keys.*
- `id`: string
- `question`: string
- `options`: string[]
- `relatedTo`: string[]

## Logic: Validation Calculation

A utility function will perform the following transformation:
`processSubmission(userAnswers: Record<string, string>, fullQuestions: Question[]): CertificationResult`
