# Research: Admin Forms View Implementation

## Decision: Implementation Strategy for Read-only Forms View

### Decision: API and UI Structure
- **Backend**: Create dedicated admin-only API routes under `app/api/admin/forms/` to avoid mixing candidate logic with administrative oversight. These routes will check for the existence of a session.
- **Frontend**: Update the main Admin page to support multiple views (Candidates, Forms). Use a sidebar/navigation component to handle the switch.
- **Rendering**: Create a `FormPreview` component that reuses the logic of `DynamicForm` but is explicitly designed for read-only display (no state management for answers, all inputs disabled or replaced with static text).

### Rationale
- **Security**: Dedicated admin APIs ensure that candidates cannot accidentally (or intentionally) list all available forms via the public `/api/forms` route.
- **Maintainability**: Separating the forms view logic from the candidate management logic in the admin panel prevents `admin/page.tsx` from becoming too bloated.
- **UX**: A read-only preview allows admins to audit the forms exactly how a candidate would see them, which is more useful than a raw JSON view.

### Alternatives Considered
- **Direct Link to JSON**: Too technical for non-developer admins.
- **Reusing `DynamicForm` with a `readOnly` prop**: Possible, but `DynamicForm` is currently quite complex and tightly coupled to answer submission. A separate `FormPreview` is cleaner and less error-prone.

## Decision: Form Metadata Storage
- **Current Pattern**: Forms are stored as `.json` files in `data/forms/`.
- **Modification**: None needed. The current structure is sufficient for the requested feature.

## Decision: Authentication Guard
- **Current Pattern**: Admin page uses `useSession` and redirects to `/admin/sign-in` if unauthenticated.
- **Modification**: APIs will also use `getServerSession(authOptions)` to ensure server-side protection.
