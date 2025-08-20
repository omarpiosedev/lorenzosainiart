# GEMINI.md

## Project Overview

This project is a comprehensive boilerplate and starter kit for Next.js 15+, designed with a strong emphasis on developer experience and a rich feature set. It utilizes the App Router, Tailwind CSS 4, and TypeScript to provide a modern and robust foundation for building web applications.

The boilerplate is pre-configured with a wide range of tools and technologies, including:

*   **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4
*   **Tooling:** ESLint, Prettier, Lefthook, Commitlint, Knip
*   **Testing:** Vitest (unit), Playwright (E2E), Storybook (UI)
*   **Authentication:** Clerk
*   **Database:** DrizzleORM (PostgreSQL, SQLite, MySQL)
*   **Internationalization (i18n):** next-intl
*   **Error Monitoring & Logging:** Sentry, LogTape
*   **AI-Powered Code Reviews:** CodeRabbit
*   **Security:** Arcjet

## Building and Running

### Prerequisites

*   Node.js 22+
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone --depth=1 https://github.com/ixartz/Next-js-Boilerplate.git my-project-name
    ```
2.  Navigate to the project directory:
    ```bash
    cd my-project-name
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Development

To start the development server with live reload, run:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production

To create a production build, run:

```bash
npm run build
```

To start the production server, run:

```bash
npm start
```

### Testing

*   **Unit Tests:**
    ```bash
    npm run test
    ```
*   **End-to-End (E2E) Tests:**
    ```bash
    npm run test:e2e
    ```
*   **Storybook:**
    ```bash
    npm run storybook
    ```

## Development Conventions

### Commits

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. To facilitate this, an interactive CLI is provided. To use it, run:

```bash
npm run commit
```

### Code Quality

Code quality is enforced through a combination of tools:

*   **ESLint:** For identifying and fixing problems in JavaScript/TypeScript code.
*   **Prettier:** For consistent code formatting.
*   **TypeScript:** For static type checking.

You can run the following commands to check the code quality:

*   `npm run lint`: Check for linting errors.
*   `npm run lint:fix`: Automatically fix fixable linting errors.
*   `npm run check:types`: Run the TypeScript compiler to check for type errors.

### Unused Code

[Knip](https://knip.dev/) is used to detect unused files and dependencies. You can run it with:

```bash
npm run check:deps
```

### Internationalization (i18n)

The project uses `next-intl` for internationalization. Locale files are located in `src/locales`. You can check for missing translations with:

```bash
npm run check:i18n
```
