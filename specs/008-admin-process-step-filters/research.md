# Research: Admin Process Step Filters & Tags

## Decisions

### 1. Default Sub-filter Behavior
- **Decision**: When "En Proceso" is selected, the sub-filter will default to "Validación Técnica" (which maps to the `technical` step, often referred to as 'challenge').
- **Rationale**: The user explicitly requested that it defaults to "challenge". This ensures that the most action-oriented group (those currently undergoing technical validation) is visible first.
- **Alternatives Considered**: Defaulting to "Todos los pasos". Rejected per user request.

### 2. UI for Step Filters (Tags)
- **Decision**: Implement the sub-filters as "Tags" or "Chips" rather than just standard tabs.
- **Rationale**: The user used the word "tags". This suggests a more compact, modern UI element (rounded buttons with counts) that feels auxiliary to the main status categories.
- **Alternatives Considered**: Dropdown. Rejected because visibility of all steps and their counts is preferred.

### 3. Step Mapping
- **Decision**: 
    - `pre-screening` -> "Pre-Screening"
    - `technical` -> "Validación Técnica" (Challenge)
    - `interview` -> "Entrevistas"
- **Rationale**: Consistent with the internal `User.step` property and existing dashboard terminology.
