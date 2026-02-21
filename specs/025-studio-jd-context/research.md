# Research: Job Description Context via URL Scraping

## Objective
To enable context-aware requirement generation by extracting job details from text or URLs.

## Scraping Strategy

### 1. Technology Choice
- **Fetch API**: Native in Node.js 20+. Sufficient for simple HTML.
- **Cheerio**: Lightweight parser for fast extraction. (To be installed).
- **User-Agent Spoofing**: Necessary to avoid immediate blocks by job boards.

### 2. Handling Complex Sites (LinkedIn, Indeed)
- These sites often use SSR but also have heavy bot detection.
- **Approach**: Best-effort scraping. If scraping fails (403, 401, or generic block), the system will prompt the user to "Copy-Paste" the text manually.
- **Future Improvement**: Integration with a headless browser (Puppeteer) or a dedicated scraping API (ScraperAPI/ProxyCrawl) if volume justifies cost.

## AI Extraction Pattern

- The system will fetch the HTML.
- It will clean the HTML into plain text (removing scripts, styles, and nav elements).
- A specialized "Discovery Flow" or "Pre-process" will extract structured metadata from the text:
  - Role Title
  - Required Technical Skills
  - Soft Skills
  - Years of Experience / Level
- This metadata will then be injected into the `StudioRequirementGenerator`.

## UI/UX Considerations

- **Placement**: A new "Job Description / URL" section before the "Generate" button.
- **Input Types**:
  - `textarea` for manual paste.
  - `input[type="url"]` for scraping.
- **Feedback**: A "Scanning..." state with indicators for "Fetching URL" -> "Extracting Context" -> "Generating Benchmarks".

## Database Impact

- `studio_requirements` schema update:
  - `job_description` (TEXT): Stores the original text or the scraped content for persistence.
  - `source_url` (TEXT): Optional field to track where the data came from.
