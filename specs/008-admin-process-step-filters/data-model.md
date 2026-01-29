# Data Model: Admin Process Step Filters

This feature uses the `step` property of the `User` (Profile) entity to provide secondary filtering for "In Process" candidates.

## Derived Entities

### CandidateStepFilter (Enum)
Represents the step-level filter applied to active candidates.

- **Values**:
    - `ALL`: Show all active candidates.
    - `PRE_SCREENING`: Candidates with at least one profile in `step === 'pre-screening'`.
    - `TECHNICAL`: Candidates with at least one profile in `step === 'technical'`. Maps to "Challenge".
    - `INTERVIEW`: Candidates with at least one profile in `step === 'interview'`.

## Logic Definition

```typescript
function matchesStepFilter(groupedCandidate: GroupedCandidate, stepFilter: string): boolean {
  if (stepFilter === 'all') return true;
  
  // A candidate matches if they have at least one profile in the selected step
  return groupedCandidate.profiles.some(profile => profile.step === stepFilter);
}
```

## Default State
- When the main status filter switches to `in-progress`, the `stepFilter` is automatically set to `technical`.
