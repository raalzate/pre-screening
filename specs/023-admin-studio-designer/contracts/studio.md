# API Contract: Studio Designer (023)

## Requirements API

### `POST /api/admin/studio/requirements/generate`
Generates a draft of technical requirements based on Role and Seniority.

- **Request Body**:
  ```json
  {
    "role": "string",
    "seniority": "string"
  }
  ```
- **Success (200 OK)**:
  ```json
  {
    "id": "role-seniority-id",
    "title": "Role Title",
    "requirements": { "skill-id": 4, "...": 3 }
  }
  ```

### `POST /api/admin/studio/requirements`
Persists a requirement profile to the database.

- **Request Body**: `RequirementProfile` (see data-model.md)
- **Success (201 Created)**: `{ "success": true }`

### `GET /api/admin/studio/requirements`
Lists all requirement profiles.

- **Success (200 OK)**: `Array<RequirementProfile>`

---

## Forms API

### `POST /api/admin/studio/forms/generate`
Generates a draft of evaluation form based on a Requirement Profile.

- **Request Body**:
  ```json
  {
    "requirementId": "string"
  }
  ```
- **Success (200 OK)**:
  ```json
  {
    "id": "form-id",
    "requirementId": "req-id",
    "title": "Title",
    "categories": [...]
  }
  ```

### `POST /api/admin/studio/forms`
Persists an evaluation form to the database.

- **Request Body**: `EvaluationForm`
- **Success (201 Created)**: `{ "success": true }`

### `GET /api/admin/studio/forms`
Lists all forms.

- **Success (200 OK)**: `Array<EvaluationForm>`
