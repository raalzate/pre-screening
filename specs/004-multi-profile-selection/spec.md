# Feature Specification: Multi-Profile Selection

**Feature Branch**: `004-multi-profile-selection`  
**Created**: 2026-01-27  
**Status**: Draft  
**Input**: User description: "es necesario tener multiples perfiles en la creacion del candidato, puedes seleccionar uno o dos perfiles, el usuario (candidado) selecciona cual desea aplicar como tal"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin Assigns Multiple Profiles (Priority: P1)

As an Administrator, when creating a new candidate, I want to be able to select multiple potential job profiles (requirements) instead of just one, so that the candidate can choose the one that best fits their skills.

**Why this priority**: Defines the flexibility needed by the business.

**Independent Test**: Create a candidate and select 2+ profiles in the requirements dropdown. Verify both are saved.

**Acceptance Scenarios**:

1. **Given** I am on the "Create Candidate" modal, **When** I click the requirements dropdown, **Then** I should be able to multi-select options.
2. **Given** I have selected multiple profiles, **When** I save the candidate, **Then** the system stores all selected profile IDs.

---

### User Story 2 - Candidate Selects Profile (Priority: P1)

As a Candidate, when I first access the pre-screening link, if multiple profiles were assigned to me, I want to see a selection screen where I can choose which profile I want to be evaluated for.

**Why this priority**: Required for the user to proceed with the correct evaluation.

**Independent Test**: Access a multi-profile candidate link. Verify selection screen appears. Select one. Verify evaluation starts with correct form.

**Acceptance Scenarios**:

1. **Given** I am a candidate with multiple assigned profiles, **When** I access my unique link, **Then** I see a "Select Profile" screen listing the options.
2. **Given** I select a profile, **When** I confirm my choice, **Then** the system updates my record to lock in that single requirement and redirects me to the corresponding pre-screening form.
3. **Given** I am a candidate with only ONE assigned profile, **When** I access my link, **Then** I go directly to the start screen (no selection needed).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow the `requirements` field in the `users` table (or logic) to accept/store multiple values (e.g., comma-separated string or JSON array).
- **FR-002**: The Create Candidate UI (Admin) MUST support multi-selection for the "Perfil / Requerimiento" field.
- **FR-003**: The Candidate Entry Guard (`app/(public)/welcome/page.tsx` or similar) MUST detect if `requirements` contains multiple values.
- **FR-004**: A new "Profile Selection" UI MUST be presented if multiple requirements are detected.
- **FR-005**: Upon candidate selection, the system MUST persist the *single* chosen requirement back to the database, effectively "locking" the choice.

### Key Entities

- **Candidate**: Modified to hold `assigned_profiles` (list) initially, which collapses to a single `requirements` (string) after selection.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can successfully assign 2+ profiles to 100% of new candidates if desired.
- **SC-002**: 100% of multi-profile candidates are forced to select a single path before seeing exam questions.
- **SC-003**: No regression for single-profile candidates (flow remains seamless).
