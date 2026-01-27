# Quickstart: Admin Multi-Profile UI

## Overview
This feature introduces a clearer way to manage candidates who are applying for multiple roles.

## How to Test

### 1. Grouping Logic
1. Go to Admin Dashboard.
2. Ensure you have a candidate with code `MULTI-X` that has 2 profiles (created via DB or previous test).
3. Check the "Select Candidate" dropdown.
4. **Pass Criteria**: `MULTI-X` appears only once.
5. Select `MULTI-X`.
6. **Pass Criteria**: You see tabs or a list of their 2 profiles (e.g., "Frontend", "Backend").

### 2. Multi-Assign Form
1. Click "Registrar Candidato".
2. Enter Code `NEW-MULTI`.
3. In "Perfiles/Requerimientos", verify you can select both "Angular" and "Java".
4. Click Save.
5. **Pass Criteria**: Success message appears. The sidebar now shows `NEW-MULTI` (possibly after refresh).
6. Select `NEW-MULTI`. Verify both profiles exist.
