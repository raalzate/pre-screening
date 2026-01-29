# Quickstart: Admin Candidate Filters

## Setup
1. Switch to branch `007-admin-candidate-filters`.
2. Ensure you have candidate data in the system (automated or manual).

## Verification Steps

### 1. Filter Display
- Open `/admin`.
- Verify the presence of the filter bar with "Todos", "En Proceso", and "Rechazados".
- Verify that counts are displayed next to each status.

### 2. "En Proceso" Filter
- Click on "En Proceso".
- Verify that candidates who haven't finished pre-screening or have approved results are visible.
- Verify that candidates with all profiles rejected are hidden.

### 3. "Rechazados" Filter
- Click on "Rechazados".
- Verify that ONLY candidates whose profiles are all rejected (`valid: false`) are visible.

### 4. Search Integration
- Select "Rechazados".
- Type a name in the search box.
- Verify that the list filters by name AND status simultaneously.
