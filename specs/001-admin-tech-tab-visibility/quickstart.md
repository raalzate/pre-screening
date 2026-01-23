# Quickstart: Conditional Admin Technical Tab Visibility

**Feature**: 001-admin-tech-tab-visibility

## Overview
This feature ensures the admin interface is clean by hiding the technical tab for candidates who haven't reached that stage yet.

## Key Changes
- Modified `app/(public)/admin/page.tsx` to filter the `tabs` array dynamically.
- The tab "Validación Técnica" is only shown if `certification_result` or `challenge_result` exists in the candidate's profile.

## Verification
1. Open the Admin Panel.
2. Select a candidate who is in the "pre-screening" phase (no technical results).
3. Confirm that only "Perfil & Pre-Screening" and "Entrevista & Feedback" tabs are visible.
4. Select a candidate who has results.
5. Confirm "Validación Técnica" appears between the other two tabs.
