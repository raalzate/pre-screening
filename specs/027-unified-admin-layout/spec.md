**Input**: User description: "unifica el diseño arquitectonico de la capa admin, que tenga el mismo layout tanto el esudio como los elementos que componen admin"

## Clarifications

### Session 2026-02-25
- Q: Should we commit to a persistent Sidebar-based navigation or a Top-nav? → A: Sidebar.
- Q: How should the sidebar behave on mobile devices when toggled? → A: Bottom Navigation.
- Q: Should the `AdminLayout` provide a standard Page Header component for all sub-pages? → A: Standard Header Component.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Unified Navigation Experience (Priority: P1)

As an administrator, I want to navigate between the Candidate Dashboard and the Studio Designer using a consistent sidebar/header navigation so that I can manage all administrative tasks without feeling like I'm switching between different applications.

**Why this priority**: This is the core requirement. It provides the visual and structural unification requested by the user.

**Independent Test**: Can be tested by logging into the admin dashboard and verifying the presence of a sidebar with links to "Candidatos", "Studio", and "Historial", and confirming that the layout remains consistent when clicking between them.

**Acceptance Scenarios**:

1. **Given** I am on the Admin Dashboard, **When** I look at the screen, **Then** I see a sidebar with "Candidatos" and "Studio" links.
2. **Given** I am on the Admin Dashboard, **When** I click "Studio", **Then** I am navigated to the Studio Designer and the sidebar remains visible and consistent.

---

### User Story 2 - Standardized Visual Identity (Priority: P2)

As an administrator, I want both the Dashboard and the Studio Designer to share the same typography, colors, and header styles so that the professional look and feel of the application is consistent across all administrative views.

**Why this priority**: Enhances the user experience and provides a cohesive professional identity for the admin layer.

**Independent Test**: Visually compare the Dashboard and Studio pages to ensure they use the same font (Inter/Sofka style), header weights, and primary color accents.

**Acceptance Scenarios**:

1. **Given** I am on any admin-related page, **When** I view the page header, **Then** it has the same style (height, logo positioning, user name/logout placement) as other admin pages.
2. **Given** I am navigating between admin views, **When** I see interactive elements (buttons, inputs), **Then** they follow a shared design system styling.

---

### Edge Cases

- **Mobile View**: How does the unified sidebar/navigation handle small screens? (The system MUST transition from a sidebar to a persistent bottom navigation bar for primary administrative links).
- **Session Timeout**: If a session expires while in Studio, does the redirect to login maintain the layout context? (Standard approach: Standard login redirect, layout reappears after auth).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a shared `AdminLayout` component used by all pages under the admin domain.
- **FR-002**: System MUST include a common sidebar-based navigation component allowing users to switch between "Candidatos" (Dashboard) and "Admin Studio".
- **FR-003**: The Admin Dashboard (`app/(public)/admin`) MUST be moved to a protected route structure to share the authentication and layout logic.
- **FR-004**: Navigation state MUST reflect the current active section (e.g., highlighting "Studio" in the sidebar when in a sub-page of the Studio).
- **FR-005**: All admin pages MUST use a consistent header style with the Sofka Technologies logo and current user information/logout.
- **FR-006**: System MUST provide a reusable `AdminPageHeader` component that standardizes title placement and primary actions across all admin views.

### Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of admin-specific pages (Dashboard, Studio, Historico) utilize the same shared Layout component.
- **SC-002**: Navigation between major admin sections is possible via a maximum of 2 clicks from any admin page.
- **SC-003**: Zero visual discrepancies in header and navigation structure when switching between "Candidatos" and "Studio".
