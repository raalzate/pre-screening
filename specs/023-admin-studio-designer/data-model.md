# Data Model: Admin Studio Designer (023)

## Database Schema (Turso)

### Table: `studio_requirements`
Stores the technical benchmarks for different roles.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Kebab-case identifier (e.g., `react-developer-sjr`) |
| `title` | TEXT | NOT NULL | Human-readable title |
| `content` | TEXT | NOT NULL | JSON string: `Record<string, number>` (descriptor-key: score) |
| `metadata` | TEXT | NULL | JSON string: `{ seniority, role, tags, ... }` |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | ISO Timestamp |

### Table: `studio_forms`
Stores the evaluation questionnaires mapped to requirements.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Kebab-case identifier |
| `requirement_id` | TEXT | REFERENCES studio_requirements(id) | The linked benchmark |
| `title` | TEXT | NOT NULL | Human-readable title |
| `content` | TEXT | NOT NULL | JSON string: `{ categories: Array<{ questions: Array<{...}> }> }` |
| `metadata` | TEXT | NULL | JSON string |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP | ISO Timestamp |

## Zod Entities (TypeScript)

### `RequirementProfile`
```typescript
const RequirementProfileSchema = z.object({
  id: z.string(),
  title: z.string(),
  requirements: z.record(z.string(), z.number().min(1).max(5)),
  metadata: z.record(z.string(), z.any()).optional()
});
```

### `EvaluationForm`
```typescript
const EvaluationFormSchema = z.object({
  id: z.string(),
  title: z.string(),
  requirementId: z.string(), // Links to RequirementProfile
  categories: z.array(z.object({
    id: z.string(),
    title: z.string(),
    questions: z.array(z.object({
      id: z.string(), // Must match a key in studio_requirements.content
      question: z.string(),
      type: z.literal('scale'),
      scaleMax: z.literal(5),
      example: z.string().optional()
    }))
  })),
  metadata: z.record(z.string(), z.any()).optional()
});
```

## State Transitions
1. **Creation**: Admin inputs Role/Seniority → AI generates Requirement Profile Draft.
2. **Persistence**: Admin saves Requirements → Table `studio_requirements` updated.
3. **Form Generation**: Requirements selected → AI generates Form Draft mapping questions to skills.
4. **Persistence**: Admin saves Form → Table `studio_forms` updated.
