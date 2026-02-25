# Data Model: Unified Admin Navigation

## Entities

### `AdminNavigationItem` (Frontend Model)

Represents a single link or section in the admin sidebar.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier for active state tracking |
| label | string | Display text (e.g., "Candidatos") |
| href | string | Destination route |
| icon | string (Lucide) | Icon name to display |
| permission | string? | Optional role required (e.g., "SUPER_ADMIN") |

## State Management

- **Navigation State**: Managed via `next/navigation`'s `usePathname()`. 
- **User Session**: Managed via `next-auth` provided in the `ProtectedLayout`.

## Relationships

- `AdminLayout` encompasses `AdminSidebar`, `AdminHeader`, and children components.
- `AdminSidebar` maps over a collection of `AdminNavigationItem`.
