# API Contract: Admin UI Interactions

## Candidate Creation Loop
Since the backend `POST /api/user` creates a single row, the Frontend will implement the multi-profile creation as a loop.

### Logic
```javascript
const profiles = ["angular", "java"];
await Promise.all(profiles.map(req => 
  fetch('/api/user', {
    method: 'POST',
    body: JSON.stringify({ ...data, requirements: req })
  })
));
```

## Candidate Fetching
`GET /api/user` returns a flat list of all rows.
Grouping happens strictly on the **Client Side** in `admin/AdminFormsView.tsx` (or parent page).
