# Research: Unified Admin Layout Architecture

## Decision: Modular Layout Pattern with Shared Navigation

The unified admin layer will follow a nested layout pattern in Next.js 15. 

### Rationale

- **Next.js Layout Nesting**: By placing `AdminLayout` inside `(protected)`, it automatically inherits the root protection and session handling from `ProtectedLayout`.
- **Reusable Components**: The sidebar and header will be extracted as standalone functional components to ensure they can be used or extended easily.
- **Access Control**: Moving the dashboard to `(protected)` ensures that authentication is handled by the server-side logic in the protected middleware/layout, rather than relying on client-side `useSession` checks alone.

### Alternatives Considered

- **Monolithic Admin Page**: Keeping everything in one large file and using state to toggle views. *Rejected* because it's not reusable and slows down performance as the feature grows.
- **Top Bar only**: Using only a header for navigation. *Rejected* because a sidebar is more standard for complex admin dashboards with multiple sections like "Candidatos", "Studio", and "Historial".

## Best Practices for Next.js 15 Sidebars

1. **Server Components where possible**: Keep the sidebar structure as a server component to reduce bundle size, using client components only for interactive elements (tabs, toggles).
2. **Active Link highlighting**: use `usePathname()` from `next/navigation` to highlight the current section.
3. **Responsive Design**: Use Tailwind's hidden/block classes along with a mobile hamburger menu for cross-device support.

## Migration Strategy: Public to Protected

1. **Move files**: `app/(public)/admin/page.tsx` → `app/(protected)/admin/page.tsx`.
2. **Remove inline auth**: Delete the local `useEffect` auth guards in favor of the layout-level protection.
3. **Handle redirects**: Update `(public)/admin/sign-in` to redirect correctly back to the new protected admin dashboard.

## Unknowns Resolved

- **Naming Inconsistency**: We will standardize on "Candidatos" for the dashboard and "Admin Studio" for the requirement/form designer.
- **Reusability**: High reusability will be achieved by creating a `BaseAdminView` wrapper that handles common margins, paddings, and header states.
