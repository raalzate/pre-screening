# Project Constitution: dev-prescreening

This document defines the non-negotiable principles for the `dev-prescreening` project.

## 1. Core Principles

- **Architecture First**: All features must be defined in `spec.md` and `plan.md` before implementation.
- **Type Safety**: New code must be written in TypeScript with strict null checks.
- **AI-Driven**: Leverage Genkit for intelligent features, following the `BaseGenerator` pattern.
- **Tessl Alignment**: All dependencies must be managed and synchronized via `tessl.json`.
- **Security**: Never expose environment variables directly; use `config.ts`.

## 2. Quality Gates

- **Linting**: No ESLint errors allowed in new PRs.
- **Build**: The project must always be in a building state.
- **Documentation**: All new API routes and components must be documented.
