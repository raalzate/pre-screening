# Implementation Plan: UI Identity Standardization

Standardize the visual identity of the application by centralizing component logic and refining the theme configuration based on the "Custom / Sofka Branding" standard.

## User Review Required

> [!IMPORTANT]
> This plan involves moving several inline components from `app/(public)/admin/page.tsx` into a central `components/ui` directory. This will improve maintainability and ensure visual consistency across the entire app.

## Proposed Changes

### Core Design System

#### [MODIFY] [tailwind.config.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/tailwind.config.ts)
- Harmonize the color palette to use `sofka` tokens more explicitly.
- Define a consistent `radius` and `spacing` scale.

#### [MODIFY] [globals.css](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/app/globals.css)
- Update CSS variables to match the refined Sofka palette.

---

### Component Standardization

#### [NEW] UI Library (`components/ui`)
- Create standardized components for:
    - `Button`: Primary, Secondary, Outline, Ghost, Danger variants using Sofka colors.
    - `Card`: Standardized shadows, padding, and border-radius.
    - `Badge`: Standardized status colors (Success, Warning, Error, Neutral).
    - `Input` & `Select`: Uniform styling for form elements.
    - `Modal`: Consistent backdrop and transition effects.

#### [MODIFY] [Admin page](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/app/(public)/admin/page.tsx)
- Refactor the 73KB file to use the new standardized components instead of inline definitions.
- Remove redundant SVG icons (use a centralized `Icons` object or library).

---

### Data Visualization

#### [MODIFY] [GapAnalysisChart.tsx](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/components/GapAnalysisChart.tsx)
- Update Recharts theme to use the standardized Sofka color tokens (`sofka-blue`, `sofka-orange`).

## Verification Plan

### Automated Tests
- Run `npm run lint` to ensure no styling inconsistencies in refactored components.
- Run `npm run build` to verify the build process remains intact.

### Manual Verification
- Visual audit of the Admin Dashboard to ensure all buttons and cards follow the new unified style.
- Verify focus rings and hover effects on standardized interactive elements.
