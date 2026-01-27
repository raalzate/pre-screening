# Tasks: Candidate History Migration

## Setup
- [x] **T001**: Update `lib/db.ts` to include `history_candidates` table initialization.
- [x] **T002**: Ensure both tables are synchronized with missing columns during `initDb`.

## Core Implementation
- [x] **T003**: Implement transactional migration logic in `/api/user/feedback`.
- [x] **T004**: Handle data mapping in the insertion query.

## Polish & Verification
- [ ] **T005**: Verify migration with a test script.
    - Path: `/Users/raul.alzate/Documents/maestria/dev-prescreening/scripts/verify_migration.ts`
- [ ] **T006**: Manual walkthrough via Admin UI.
