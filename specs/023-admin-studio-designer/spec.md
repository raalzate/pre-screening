# Feature Specification: Admin Studio Designer

**Feature Branch**: `023-admin-studio-designer`  
**Created**: 2026-02-18  
**Status**: Draft  
**Input**: User description: "Crea una funcionalidad llamada estudio para construir las formularios y los requisitos de manera tal permita registrar los formularios y los requisitos para la posición. Orientate con el prompt data/FORMS_PROMPT.md para los formlarios y data/REQ_PROMPT.md para los requisitos, debemos tener todos contexto uno para formularios y otro para los requisitos, los formularios requiere de los requisitos."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Designing Requirement Profiles (Priority: P1)

As an administrator, I want to define the technical requirements for a job position, including specific skills and their importance (1-5), so that the pre-screening system has a benchmark for evaluation.

**Why this priority**: This is the foundation of the screening process. Without requirements, forms cannot be validated or mapped correctly.

**Independent Test**: An admin can create a new requirement profile (e.g., "Fullstack Developer") with a list of skills and weights, and save it successfully.

**Acceptance Scenarios**:
1. **Given** the Admin Studio page, **When** I select "Create Requirements", **Then** I see a list of available technical descriptors.
2. **Given** a list of descriptors, **When** I select specific skills and assign a score from 1 to 5, **Then** the system calculates a preliminary profile ID (kebab-case).
3. **Given** a completed profile, **When** I click "Save Requirement", **Then** a JSON file is registered in the system.

---

### User Story 2 - Designing Evaluation Forms (Priority: P2)

As an administrator, I want to build a customized evaluation form by organizing questions into categories and linking them to the requirement profile, so that candidates are interviewed on relevant topics.

**Why this priority**: Focuses on the candidate experience and data collection, enabling the automated screening.

**Independent Test**: An admin can create a form, add categories/questions, and link them to an existing requirement profile's IDs.

**Acceptance Scenarios**:
1. **Given** an existing requirement profile, **When** I start the "Form Designer", **Then** I am prompted to select the target requirements.
2. **Given** a category, **When** I add a question, **Then** I must select which specific requirement key it maps to.
3. **Given** a question, **When** I define it as a "scale" type (0-5), **Then** I can provide a code/practice example for the candidate's reference.

---

### User Story 3 - Studio Dashboard & Registration (Priority: P3)

As an administrator, I want to see a central dashboard of all designed forms and requirements, with the ability to edit or register new ones, so that I can manage the recruitment pipeline efficiently.

**Why this priority**: Provides the management layer for the "Studio" feature.

**Independent Test**: Admin can see a list of all active forms and requirements and initiate the creation of a new one.

**Acceptance Scenarios**:
1. **Given** the Studio Dashboard, **When** I see the list of requirements, **Then** I can see which forms are associated with them.
2. **Given** a draft requirement or form, **When** I submit it, **Then** the system validates that all form questions map to valid requirement keys.

### Edge Cases

- **Missing Mapping**: What happens if a form question maps to a key that doesn't exist in the requirements? (System must block saving).
- **Duplicate IDs**: How does the system handle registering a profile with an ID that already exists? (Prompt for overwrite or unique naming).
- **Empty Categories**: Form must contain at least one category and one question to be valid.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating requirement profiles with ID (kebab-case), Title, and a map of skills/scores (1-5).
- **FR-002**: System MUST use the descriptors provided in `FORMS_PROMPT.md` and `REQ_PROMPT.md` as the source of truth for skill categories.
- **FR-003**: System MUST allow creating forms with Categories and Questions.
- **FR-004**: Each form question MUST link to exactly one requirement key defined in the associated requirement profile.
- **FR-005**: System MUST support "scale" type questions with a maximum value of 5.
- **FR-006**: System MUST persist the resulting configurations as JSON files in the designated data directories.
- **FR-007**: System MUST validate that every requirement key used in a form exists in the linked requirement profile before allowing registration.

### Key Entities *(include if feature involves data)*

- **RequirementProfile**: Represents the technical benchmark. Fields: `id`, `title`, `requirements` (Record<string, number>).
- **EvaluationForm**: Represents the candidate-facing questionnaire. Fields: `id`, `title`, `categories` (Array of objects with `id`, `title`, `questions`).
- **Question**: An item within a form category. Fields: `id` (maps to requirement key), `question` (text), `type` (scale), `scaleMax` (5), `example`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An administrator can create a complete Requirement + Form pair in under 10 minutes.
- **SC-002**: 100% of saved forms have valid mappings to their respective requirement profiles.
- **SC-003**: System displays real-time validation errors if a form question ID does not match any requirement key.
- **SC-004**: Dashboard loads the list of existing configurations in under 1 second.
