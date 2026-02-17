# Tasks: Recruiter Notifications

- [x] Phase 1: Infrastructure <!-- id: T1 -->
    - [x] Add `created_by` to DB schema <!-- id: T2 -->
    - [x] Configure `DEFAULT_RECRUITER_EMAIL` in `config.ts` <!-- id: T3 -->
    - [x] Implement `sendRecruiterNotification` in `email.ts` <!-- id: T4 -->

- [x] Phase 2: Implementation <!-- id: T5 -->
    - [x] Capture admin email in `api/user/route.ts` <!-- id: T6 -->
    - [x] Hook notification in `api/evaluation/route.ts` <!-- id: T7 -->
    - [x] Hook notification in `api/user/retry/route.ts` <!-- id: T8 -->

- [x] Phase 3: Verification <!-- id: T9 -->
    - [x] Run linting and type checks <!-- id: T10 -->
    - [x] Update walkthrough artifact <!-- id: T11 -->
