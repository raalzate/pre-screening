# Quickstart: Admin View Forms

## Overview
The "Admin View Forms" feature provides a new interface in the administrative panel where coordinators and recruiters can review the pre-screening forms currently active in the system.

## Key Features
- **Form Directory**: A list of all available pre-screening form templates.
- **Read-only Preview**: View the exact structure, categories, and questions of any form without the ability to modify them.
- **Role-based Access**: Accessible only to authenticated administrative users.

## How to Access
1. Log into the Admin panel (`/admin`).
2. Use the navigation to switch to the "Formularios" view.
3. Browse the list and select any form to see its content.

## Technical Details
- **APIs**:
    - `GET /api/admin/forms`: Lists all form headers.
    - `GET /api/admin/forms/[id]`: Returns the full form specification.
