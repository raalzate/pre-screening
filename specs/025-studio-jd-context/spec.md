# Feature Specification: Job Description Context for Requirement Designer

**Feature Branch**: `025-studio-jd-context`  
**Created**: 2026-02-19  
**Status**: Draft  
**Input**: User description: "en el Diseñador de Requisitos debo pasarle un job description para poder tener contexto del rol y asi mismo descubir los descriptores mas adecuados para el requerimiento"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - AI-Assisted Requirement Generation with JD (Priority: P1)

As an administrator, I want to paste a Job Description text into the Requirement Designer so that the AI can suggest more relevant and specific requirements (skills, levels, weights) based on the actual job details.

**Why this priority**: Core functionality requested by the user. It transforms the current manual/generic generation into a context-aware discovery process.

**Independent Test**: Can be tested by navigating to the Requirement Designer, providing a JD, and verifying that the generated benchmarks are significantly more aligned with the JD than generic role-based generation.

**Acceptance Scenarios**:

1. **Given** I am in the "New Requirement" page, **When** I paste a valid Job Description and click "Explore with AI", **Then** the system should suggest a list of skills and weights derived from the JD context.
2. **Given** I have provided a JD, **When** the AI generation completes, **Then** the suggested requirements should include specific technical and soft skills explicitly mentioned or implied in the JD.

---

### User Story 2 - JD Persistence for Traceability (Priority: P2)

As an administrator, I want the Job Description used for generation to be saved with the Requirement Profile so that I can reference the source of the requirements in the future.

**Why this priority**: Ensures data integrity and allows future audits or refinements based on the original source text.

**Independent Test**: Create a profile using a JD and verify that the JD text is accessible when viewing the profile details.

**Acceptance Scenarios**:

1. **Given** I have saved a Requirement Profile generated with a JD, **When** I view the profile details, **Then** I should see the JD text used for its creation.

---

### User Story 3 - Visual Comparison (JD vs. Generated) (Priority: P3)

As an administrator, I want to see how the JD maps to the generated requirements during the design phase.

**Why this priority**: Enhances trust in the AI's discovery process by showing why certain requirements were suggested.

**Independent Test**: Observe the generation UI and verify that some form of "Source mapping" or highlights are provided.

**Acceptance Scenarios**:

1. **Given** the generation is complete, **When** I review the results, **Then** I should see a summary or "Extract" from the JD that justifies the most critical suggested skills.

---

### Edge Cases

- **Empty JD**: If the user provides only a role name but no JD, the system should fall back to generic role-based generation.
- **Very Long JD**: The system should handle large JD texts (up to industry standards, e.g., 5000 characters) without crashing or timing out the AI provider.
- **Garbage Text**: If the JD is nonsense, the system should return a friendly error or a generic generation warning.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a text area field in the Requirement Designer UI for "Job Description" input.
- **FR-002**: System MUST include the provided Job Description as primary context in the AI prompt for requirement discovery.
- **FR-003**: System MUST identify and extract key technical skills, soft skills, and experience levels from the JD.
- **FR-004**: System MUST differentiate between "explicitly mentioned" and "implied" requirements if possible.
- **FR-005**: System MUST persist the JD text in the `studio_requirements` table (or associated storage).
- **FR-006**: System MUST support input via plain text paste and Job URL scraping (e.g., LinkedIn, corporate sites).
- **FR-007**: AI Generation MUST prioritize discovery from the scraped URL or provided JD context over generic template data.
- **FR-008**: System MUST handle URL scraping failures gracefully, falling back to a plain text request if the URL is inaccessible.

### Key Entities *(include if feature involves data)*

- **Requirement Profile**: Represents the set of benchmarks. Now includes a `job_description` field.
- **AI Prompt Context**: A transient structure passed to the generator containing role, industry, and the new JD text.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administrators can generate a requirement profile with JD context in under 60 seconds.
- **SC-002**: 80% of generated skills should match keywords or concepts present in the provided JD.
- **SC-003**: Profiles created with JD context require 30% fewer manual adjustments by administrators compared to generic generation.
- **SC-004**: System handles JDs up to 10,000 tokens (approx 7,500 words) for context analysis.

## Assumptions

- The existing `studio_requirements` table can be easily migrated to add a `job_description` column.
- The `gemini-2.0-flash` model has sufficient context window for standard Job Descriptions.
- Users will primarily copy-paste text from corporate sites or documents.
