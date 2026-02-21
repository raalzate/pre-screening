# Implementation Plan: JD Context via URL Scraping

**Branch**: `025-studio-jd-context` | **Date**: 2026-02-19 | **Spec**: [/specs/025-studio-jd-context/spec.md](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/specs/025-studio-jd-context/spec.md)

## Summary
Implement a Job Description (JD) context-aware requirement generation system. This allows administrators to provide a JD via plain text or a URL, which the AI will analyze to discover the most suitable benchmarks (skills, weights, levels).

## Technical Context
**Language/Version**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: `cheerio` (for scraping), `axios`, `genkit`, `zod`
**Storage**: Turso (SQLite/LibSQL)
**Testing**: `npm test`
**Target Platform**: Vercel

## Proposed Changes

### [Database]
#### [MODIFY] [db.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/lib/db.ts)
- Update `initDb` to add `job_description` (TEXT) and `source_url` (TEXT) columns to `studio_requirements` idempotently.
- Update `saveStudioRequirement` helper to include these new fields.

### [AI Services]
#### [NEW] [jdScraper.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/lib/ia/jdScraper.ts)
- Implement a service to fetch and parse HTML using `cheerio`.
- Clean content to extract meaningful text for AI processing.
#### [MODIFY] [studioRequirementGenerator.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/lib/ia/studioRequirementGenerator.ts)
- Update the generator to accept `jobDescription` as an optional context.
- Refine the `promptTemplate` to prioritize skills found in the provided context.

### [Backend API]
#### [NEW] [jd-extract/route.ts](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/app/api/admin/studio/jd-extract/route.ts)
- Create an endpoint that receives a URL or text and returns the cleaned JD context.

### [Frontend UI]
#### [MODIFY] [new/page.tsx](file:///Users/raul.alzate/Documents/maestria/dev-prescreening/app/(protected)/admin/studio/requirements/new/page.tsx)
- Add an "Extra context (Job Description or URL)" input area.
- Add a "Discover from JD" action that triggers the extraction and subsequently the benchmark generation.

## Verification Plan

### Automated Tests
- Test `jdScraper` with mock HTML strings.
- Test `StudioRequirementGenerator` with and without JD context to verify improved relevance.

### Manual Verification
1. Open Requirement Designer.
2. Paste a JD for "Senior React Developer".
3. Verify that the generated skills include "React", "TypeScript", and specific libraries mentioned in the text.
4. Provide a public Job URL and verify scraping succeeds (where possible).
