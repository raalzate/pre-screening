# Data Model: Admin View Forms

This document describes the data structures used by the Admin View Forms feature.

## Form Template (External Storage)

Forms are stored as JSON files.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier (matches filename) |
| `title` | `string` | Display name of the form |
| `categories` | `Category[]` | List of question groups |

### Category

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier for the category |
| `title` | `string` | Display name of the category |
| `questions` | `QuestionTemplate[]` | List of questions in this category |

### QuestionTemplate

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier for the question |
| `question` | `string` | The actual prompt/question text |
| `type` | `"scale"` | Type of answer (currently only scale) |
| `scaleMax` | `number` | Maximum value for the scale (e.g., 4) |
| `example` | `string` | A hint or example answer to guide the candidate |
