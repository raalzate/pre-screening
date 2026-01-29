# Tasks: Admin AI Form Analysis

- [ ] Setup AI Infrastructure
    - [x] Create `lib/ia/formAnalysisGenerator.ts` using Genkit pattern <!-- id: 0 -->
    - [x] Create `app/api/admin/forms/analysis/route.ts` with auth check <!-- id: 1 -->
- [x] Update Frontend Components
    - [x] Modify `components/admin/FormPreview.tsx` to include "Analizar con IA" button <!-- id: 2 -->
    - [x] Implement `localStorage` caching logic (1-day TTL) in `FormPreview.tsx` <!-- id: 3 -->
    - [x] Add loading state (Spinner) and analysis display (Markdown) in `FormPreview.tsx` <!-- id: 4 -->
- [x] Verification
    - [x] Manual test: Generate analysis from form preview <!-- id: 5 -->
    - [x] Manual test: Verify caching works as expected <!-- id: 6 -->
    - [x] Run `npm run lint` <!-- id: 7 -->
