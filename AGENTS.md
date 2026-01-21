# Agent Rules and Guidelines

This document outlines the essential rules, commands, and style guidelines for AI agents operating within this repository. Adhering to these guidelines ensures consistency, maintainability, and high-quality code.

## 1. Build, Lint, and Test Commands

Agents must use the following commands for building, linting, and testing the project.

### 1.1 General Commands

*   **Install Dependencies:**
    ```bash
    npm install
    ```
    Always run this command after cloning the repository or if `package.json` has changed.

*   **Development Server:**
    ```bash
    npm run dev
    ```
    Starts the Next.js development server.

*   **Build Project:**
    ```bash
    npm run build
    ```
    Compiles the project for production. This command must pass without errors before any changes are considered complete.

*   **Start Production Server:**
    ```bash
    npm run start
    ```
    Starts the Next.js production server (after building).

### 1.2 Code Quality & Verification

*   **Linting:**
    ```bash
    npm run lint
    ```
    Runs ESLint to check for code style violations and potential errors. All linting issues must be resolved.

*   **Type Checking:**
    ```bash
    tsc --noEmit
    ```
    Performs TypeScript type checking without emitting JavaScript files. This command ensures type safety across the codebase and must pass without errors.

*   **Testing (Hypothetical - assuming Jest):**
    This project does not have explicit test scripts defined in `package.json` or a clear testing framework indicated by file patterns. If tests were to be implemented, Jest is a common choice for Next.js/React projects.

    *   **Run All Tests:**
        ```bash
        npx jest
        ```
        (If Jest is installed and configured)

    *   **Run a Single Test File:**
        ```bash
        npx jest <path-to-test-file>
        # Example: npx jest src/components/button.test.tsx
        ```
        (If Jest is installed and configured)

    **Agent Note:** If you introduce tests, ensure a testing framework (e.g., Jest, React Testing Library) is properly installed and configured, and update `package.json` with appropriate `test` scripts.

## 2. Code Style Guidelines

Adherence to these guidelines is crucial for maintaining a consistent and readable codebase.

### 2.1 Imports

*   **Order:**
    1.  Third-party libraries (e.g., `react`, `next`, `axios`).
    2.  Absolute imports (e.g., `@/components/Button`).
    3.  Relative imports (e.g., `../utils/helpers`).
*   **Alias:** Use the `@/` alias for absolute imports from the project root (configured in `tsconfig.json`).
*   **No Unused Imports:** Remove any unused imports.

### 2.2 Formatting

*   **Automated Formatting:** Rely on ESLint (as configured in `package.json`) for automatic formatting. If Prettier is also configured, ensure its rules are respected.
*   **Indentation:** 2 spaces.
*   **Quotes:** Single quotes for strings.
*   **Trailing Commas:** Always use trailing commas for multiline arrays and objects.

### 2.3 Types

*   **TypeScript First:** All new code should be written in TypeScript.
*   **Explicit Types:** Use explicit types for function parameters, return values, and complex variables where inference is not clear.
*   **Interface vs. Type:** Prefer `type` for simple aliases and union types, and `interface` for object shapes and classes.
*   **Strictness:** Adhere to the strict type checking rules enabled in `tsconfig.json`.

### 2.4 Naming Conventions

*   **Variables & Functions:** `camelCase` (e.g., `getUserData`, `isLoading`).
*   **React Components:** `PascalCase` (e.g., `UserProfile`, `Button`).
*   **Type & Interface Names:** `PascalCase` (e.g., `UserProps`, `ApiError`).
*   **Constants:** `UPPER_SNAKE_CASE` for global constants (e.g., `API_BASE_URL`).

### 2.5 Error Handling

*   **Explicit Error Handling:** Implement robust `try...catch` blocks for asynchronous operations and potential failure points.
*   **User Feedback:** Provide clear and informative error messages to the user where applicable.
*   **Logging:** Use appropriate logging mechanisms for debugging and monitoring errors.

### 2.6 React/Next.js Specific Guidelines

*   **Functional Components & Hooks:** Prefer functional components and React Hooks for state and side effects.
*   **Props:** Use destructuring for props.
*   **Styling:** Use Tailwind CSS classes for styling. Adhere to existing Tailwind conventions. Avoid inline styles unless absolutely necessary.
*   **API Calls:** Centralize API calls where appropriate (e.g., using `axios` or a dedicated data fetching library).

### 2.7 Existing Rules

*   **`@.tessl/RULES.md`**: Follow the instructions in `.tessl/RULES.md` for agent-specific operational rules. The content of this file is dynamically updated by `tessl install`.

This `AGENTS.md` aims to provide a comprehensive guide for agents to effectively contribute to and maintain the codebase.
