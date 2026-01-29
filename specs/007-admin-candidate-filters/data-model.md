# Data Model: Admin Candidate Filters

This feature uses the existing candidate data structures and introduces a virtual "Status" derived from the evaluation results.

## Derived Entities

### CandidateStatus (Enum)
Represents the recruitment status of a grouped candidate.

- **Values**:
    - `EN_PROCESO`: Default status. Candidate has at least one profile that is either:
        - Pending pre-screening (no `evaluation_result`).
        - Approved pre-screening (`evaluation_result.valid === true`).
    - `RECHAZADO`: Candidate has one or more profiles, and ALL of them have `evaluation_result.valid === false`.

## Existing Entities (Reference)

### GroupedCandidate
- `code`: string (Unique identifier)
- `name`: string
- `profiles`: User[]

### User (Profile)
- `evaluation_result`: object | null
    - `valid`: boolean
- `step`: string (e.g., "pre-screening", "technical", "interview")

## Logic Definition

```typescript
function getCandidateStatus(groupedCandidate: GroupedCandidate): 'EN_PROCESO' | 'RECHAZADO' {
  const hasValidOrPending = groupedCandidate.profiles.some(p => 
    !p.evaluation_result || p.evaluation_result.valid === true
  );
  
  return hasValidOrPending ? 'EN_PROCESO' : 'RECHAZADO';
}
```
