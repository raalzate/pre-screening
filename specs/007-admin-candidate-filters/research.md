# Research: Admin Candidate Filters

## Decisions

### 1. Filtering Implementation
- **Decision**: Client-side filtering within the `useMemo` hook in `app/(public)/admin/page.tsx`.
- **Rationale**: The `users` list is relatively small (<1000 candidates expected). Client-side filtering provides immediate UI feedback without additional network latency. The current architecture already groups candidates on the client using `groupCandidatesByCode`, so keeping the filtering logic next to it is highly efficient.
- **Alternatives Considered**: 
    - **Server-side filtering**: Rejected because it would require significant changes to the `/api/user` endpoint and the grouping logic, adding complexity without immediate performance benefits at current scale.

### 2. Status Determination
- **Decision**: A candidate is considered "Rechazado" (Rejected) if AND ONLY IF all their profiles have an `evaluation_result.valid === false`.
- **Rationale**: If a candidate has multiple applications and at least one is "valid" or "pending" (no evaluation result yet), they should remain in the "En Proceso" view to ensure they receive proper attention.
- **Alternatives Considered**:
    - **Any rejection**: Rejected because it might hide candidates who have other successful profiles.

### 3. UI Component
- **Decision**: Use a Tab-like UI (similar to the existing "Candidatos / Formularios" toggle) for "Todos", "En Proceso" and "Rechazados".
- **Rationale**: Consistent with existing design language in the admin dashboard.
