# Quickstart: Multi-Profile Candidates

## Overview
This feature allows administrators to assign multiple profiles (requirements) to a single candidate. Candidates then select which profile they wish to pursue upon logging in.

## How to Test

### 1. Admin: Create Multi-Profile Candidate
1. Go to the Admin dashboard.
2. Click "Registrar Candidato".
3. Enter Name/Email.
4. In "Perfil / Requerimiento", select **multiple** options (e.g., Angular Frontend AND Java Backend).
5. Submit.

### 2. Candidate: Selection Flow
1. Access the candidate link with the generated code.
2. Verify you land on a "Select Profile" screen instead of the welcome screen.
3. Click on one of the profiles (e.g., Angular Frontend).
4. Verify the flow proceeds to the correct welcome/start screen for that profile.

### 3. Database Verification
Run the following SQL to confirm schema:
```sql
PRAGMA table_info(users);
-- Verify 'pk' column shows > 0 for both code and requirements
```
