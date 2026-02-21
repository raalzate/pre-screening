# Research: Admin Studio Designer (023)

## Decision: Database Persistence for Studio Configurations
**Rationale**: The user requirements specify that configurations (Requirements and Forms) must be saved in the database as complete JSON objects with filtering metadata. This allows for centralized management, versioning (if needed later), and avoids the overhead of file system synchronization in a cloud environment.

**Alternatives considered**:
- **File System (Current pattern)**: Simple but hard to manage dynamically (e.g., listing configurations, multi-user edits, cloud persistence).
- **Embedded in existing tables**: Would clutter `users` table and make configurations less reusable across different positions.

## Decision: AI Generation via Genkit Flows
**Rationale**: Following the project's `BaseGenerator` pattern ensures consistency. Using `gemini-2.0-flash` for JSON generation provides a good balance between speed and quality.

**Standards Compliance**:
- The prompt will explicitly include the `data/descriptors.json` content as the "source of truth".
- Validators will ensure that generated keys exist in the `descriptors.json` standard.

## Decision: Table Schema Mapping
**Tables**:
- `studio_requirements`: Stores the benchmark skills/scores.
- `studio_forms`: Stores the questionnaire mapped to requirements.

**Metadata Fields**:
- `id`: Unique identifier (e.g., `nestjs-backend-senior`).
- `title`: Descriptive name.
- `metadata`: JSON field containing `seniority`, `role_type`, `version`, etc.

## AI Generation Flaws & Mitigations
- **Hallucinated Keys**: Mitigation: Inject `descriptors.json` keys into the Zod schema's `enum` if possible, or perform post-generation validation.
- **Inconsistent Scores**: Prompt will strictly define the 1-5 scale logic.
