# Feature Specification: Admin Multi-Profile UI

**Feature Branch**: `005-admin-multi-profile-ui`
**Created**: 2026-01-27
**Status**: Draft
**Input**: User description: "en el formulario de 'nuevo candidato' los perfiles puede ser multiples seleccion, en el filtro de candidatos debe agrupar candidato por codigo, dado que puedo tener diferentes formularios por codigo"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Candidate Grouping in Dashboard (Priority: P1)

As an Administrator, I want to see candidates grouped by their unique access code in the dashboard dropdown, so that I don't see duplicate entries for the same person when they have multiple active applications.

**Why this priority**: Fixes the visual redundancy caused by the multi-profile data structure.

**Independent Test**:
1. Seed the database with a user having 2 profiles (same code).
2. Open the Admin dashboard.
3. Verify the user appears ONLY ONCE in the "Select Candidate" dropdown.
4. Verify the label clearly indicates their name (and possibly code).

**Acceptance Scenarios**:
1. **Given** a candidate has 3 active profiles, **When** I view the candidate list, **Then** I see a single entry for that candidate.
2. **Given** I select that grouped candidate, **When** the dashboard updates, **Then** I see an expanded view or sub-tabs showing each individual application (profile) they have.

---

### User Story 2 - Multi-Profile Assignment (Priority: P1)

As an Administrator, when registering a new candidate, I want to be able to check multiple boxes for "Requerimientos" (Profiles), so I can assign them to valid for Frontend and Backend simultaneously.

**Why this priority**: Enables the core business value of multi-profile assessment.

**Independent Test**:
1. Open "Registrar Candidato" modal.
2. Select "Angular" and "NodeJS" from the requirements list.
3. Click Save.
4. Verify in DB that two rows keying off the same code are created.

**Acceptance Scenarios**:
1. **Given** the new candidate form, **When** I click the "Perfiles" input, **Then** I can toggle multiple options.
2. **Given** I selected 2 profiles, **When** I submit, **Then** the backend receives a request to create profiles for both.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The "Select Candidate" dropdown MUST deduplicate entries by `code`.
- **FR-002**: The "Select Candidate" dropdown item label SHOULD follow the format: `NAME (CODE)`.
- **FR-003**: Upon selecting a grouped candidate, the Admin View MUST display all associated profiles (e.g., as sub-tabs or a consolidated summary view).
- **FR-004**: The "Create Candidate" form's "Requirements" field MUST be converted from a single-select to a multi-select (e.g., checkboxes or multi-select dropdown).
- **FR-005**: The frontend MUST iteratively call the creation API (or send a bulk payload if supported) to create all selected profiles.

### Key Entities

- **Candidate Group**: A virtual aggregation of `User` rows that share the same `code`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero duplicate names in the Admin candidate selector.
- **SC-002**: 100% of newly created multi-profile candidates appear correctly in the group view.
- **SC-003**: Admin can assign 3 different profiles to a candidate in a single form submission flow.

## Assumptions

- We will reuse the existing `POST /api/user` endpoint. If it doesn't support bulk, the frontend will loop the requests.
- The "Code" is the unique grouper.
