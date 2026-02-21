# Tasks: JD Context via URL Scraping

## Phase 1: Setup & Data Model
- [x] Install dependencies (`cheerio`) <!-- id: 20 -->
- [x] Update `lib/db.ts` to add `job_description` and `source_url` columns to `studio_requirements` table <!-- id: 21 -->
- [x] Update `saveStudioRequirement` in `lib/db.ts` to support new fields <!-- id: 22 -->

## Phase 2: Backend & AI Services
- [x] Implement `lib/ia/jdScraper.ts` with basic URL content extraction <!-- id: 23 -->
- [x] Update `StudioRequirementGenerator` in `lib/ia/studioRequirementGenerator.ts` to handle `jobDescription` prompt context <!-- id: 24 -->
- [x] Create `app/api/admin/studio/jd-extract/route.ts` endpoint for JD discovery <!-- id: 25 -->

## Phase 3: Frontend UI
- [x] Add "Extra Context" section to `app/(protected)/admin/studio/requirements/new/page.tsx` <!-- id: 26 -->
- [x] Implement URL/Text input and "Discover" button logic <!-- id: 27 -->
- [x] Integrate extraction result into the AI generation flow <!-- id: 28 -->

## Phase 4: Verification
- [ ] Verify database migration succeeds on app start <!-- id: 29 -->
- [ ] Verify URL scraping with public job posts <!-- id: 30 -->
- [ ] Verify AI generation relevance with JD context <!-- id: 31 -->
- [ ] Create Walkthrough <!-- id: 32 -->
