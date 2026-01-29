# Quickstart: Admin Process Step Filters

## Setup
1. Switch to branch `008-admin-process-step-filters`.
2. Ensure you have candidates in different stages (pre-screening, technical, interview).

## Verification Steps

### 1. Default Behavior
- Open `/admin`.
- Click on the "En Proceso" status filter.
- **Expectation**: The secondary row of "Step" tags appears automatically.
- **Expectation**: "Validación Técnica" (Challenge) is selected by default.
- **Expectation**: The list only shows candidates currently in the Challenge step.

### 2. Step Filtering
- Click on the "Pre-Screening" tag.
- **Expectation**: The list updates to show only candidates in the pre-screening phase.
- **Expectation**: Counts in the tags update correctly.

### 3. Visibility Logic
- Click on the "Rechazados" status filter.
- **Expectation**: The secondary row of Step tags disappears (or is clearly labeled as not applicable).

### 4. Search Integration
- With "En Proceso" and "Técnica" active, search for a candidate.
- **Expectation**: Search results respect all active filters.
