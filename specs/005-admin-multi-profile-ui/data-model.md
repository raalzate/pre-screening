# Data Model: Admin Multi-Profile VIew

## Virtual Entities

### GroupedCandidate
This entity does not exist in the DB but is constructed in the frontend View.

```typescript
type GroupedCandidate = {
  code: string;      // Unique Identifier for the human
  name: string;      // Display Name (taken from first record)
  profiles: User[];  // List of all DB records for this code
}
```

### Display Logic
- **List Item**: Shows `name` and count of `profiles`.
- **Detail View**: 
  - Header: `name` + `code` + `email`
  - Body: Tabs for each `profiles[i].requirements`

## Database Entities
No changes to `users` table schema. We utilize the existing `(code, requirements)` structure.
