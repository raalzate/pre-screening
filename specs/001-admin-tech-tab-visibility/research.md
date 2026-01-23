# Research: Conditional Admin Technical Tab Visibility

**Status**: Complete

## Decision 1: Triggering Condition
- **Decision**: The "Validación Técnica" tab will be visible only if `userData.certification_result` OR `userData.challenge_result` is truthy.
- **Rationale**: The technical tab's content relies entirely on these two objects. Checking their presence directly is more reliable than checking the `step` field, which might be in a transitional state.
- **Alternatives Considered**: 
    - `step`-based check: Rejected because `step` might be 'certified' but results might still be loading or malformed.
    - `questions`-based check: Rejected because questions exist before the certification result is generated.

## Decision 2: Implementation Point
- **Decision**: Filter the `tabs` array passed to the `Tabs` component in `app/(public)/admin/page.tsx`.
- **Rationale**: This is the cleanest way to hide the tab from the navigation without modifying the `Tabs` component itself.
- **Alternatives**:
    - Conditional rendering of the `Tabs` component: Rejected because we still need the other tabs.
    - Modifying `Tabs` component: Rejected to keep the component generic and reusable.

## Best Practices
- **Conditional Array Filtering**: Use `[].filter(Boolean)` pattern or explicit conditional spreading to maintain clean JSX.
