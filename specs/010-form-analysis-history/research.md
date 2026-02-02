# Research: Historical AI Form Analysis Results

## Decision: Storage Format for Markdown
- **Decision**: Store the raw AI-generated Markdown as a `TEXT` column in SQLite.
- **Rationale**: Markdown is inherently text. Storing it as `TEXT` allows for easy debugging, direct readability in DB tools, and leverages SQLite's efficient text handling.
- **Alternatives considered**: `BLOB` (Binary Large Object). Rejected because Markdown doesn't benefit from binary storage unless compressed, and text searchability is preferred.

## Decision: Database Schema
- **New Table**: `form_analyses`
    - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
    - `form_id`: TEXT (Reference to form template filename/ID)
    - `analysis_text`: TEXT (The Markdown content)
    - `score`: INTEGER
    - `total_possible`: INTEGER
    - `percentage`: INTEGER
    - `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP
- **Rationale**: Standard normalization. Linking back to `form_id` allows us to query history for a specific form.

## Decision: UI Integration Pattern
- **Pattern**: Add a secondary action button "Ver Reportes" (History) in each form card within `AdminFormsView`.
- **Display**: Use a Modal (`FormHistoryModal`) to show the list of reportes. This keeps the user in context without navigating away from the forms list.
- **Rationale**: Localized context. Users want to see the history *for* a form they are currently looking at.

## Decision: API Structure
- **POST `/api/admin/forms/analysis`**: Update to save result to `form_analyses` table after generation.
- **GET `/api/admin/forms/history/[id]`**: New endpoint to fetch all entries from `form_analyses` where `form_id = id` ordered by `created_at DESC`.
