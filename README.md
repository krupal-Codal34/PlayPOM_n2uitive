# PlayPOM N2uitive - E2E Test Automation Framework

This project is an end-to-end test automation framework built with [Playwright](https://playwright.dev/) and TypeScript. It utilizes the Page Object Model (POM) design pattern and is enhanced by a custom framework wrapper named `PlayPOM` to streamline test creation and execution for the N2uitive application.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (LTS version 18.x or higher is recommended)
- [Visual Studio Code](https://code.visualstudio.com/) (Recommended IDE)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd PlayPOM_n2uitive
    ```

2.  **Install project dependencies:**
    This will install Playwright, the `playpom` framework, and other required packages.
    ```bash
    npm install
    ```

3.  **Install Playwright browsers:**
    This command downloads the browser binaries required by Playwright (Chromium, Firefox, WebKit).
    ```bash
    npm run installBrowsers
    ```

## Configuration

### Main Application URL
The base URL for the application under test can be configured in the `ProjectConfig.properties` file:
```properties
# Base URL for the application under test
baseURL=https://salish-qa.xyz.n2uitive.com/login?redirectTo=/
```

### Framework and Reporter Configuration
Advanced configurations for test execution, browser projects, and reporters are managed in `playwright.config.ts`. This project is pre-configured with multiple reporters, including:
- `html`: Standard Playwright HTML report.
- `json`: JSON output of test results.
- `playpom`: Custom framework reporter.
- `ortoni-report`: A custom, detailed HTML report.

## How to Run Tests

This framework provides several scripts in `package.json` to execute tests based on different needs.

### Run All Tests
To execute the entire test suite across all configured browsers:
```bash
npm run all
```

### Run a Specific Test File
To run a single test file (e.g., `Login.spec.ts`):
```bash
npm run givenTest --test=Login.spec.ts
```

### Run Tests by Tag
To run tests that have a specific `@tag` in their title (e.g., `@smoke`):
```bash
npm run tag --tag=@smoke
```

### Run on a Specific Browser/Project
To run tests against a specific project defined in `playwright.config.ts` (e.g., `chromium` or `firefox`):
```bash
npm run givenProject --project=chromium
```

### Debugging Tests
To open the Playwright Inspector and debug a specific test step-by-step:
```bash
npm run debugTest --test=Login.spec.ts
```

## Viewing Test Reports

After a test run, reports are generated in the `./generated/reports/` directory.

### View Standard Playwright Report
To view the default interactive HTML report:
```bash
npm run showReport
```

### View Custom Ortoni Report
To view the custom-themed HTML report:
```bash
npm run showOReport
```

## Project Structure

```
.
├── Data/                   # Test data files (JSON, Excel, etc.).
├── generated/              # Auto-generated files (reports, logs, traces).
├── pages/                  # Page Object Model files, organized by feature.
├── tests/                  # Test suites (`.spec.ts` files).
├── .github/workflows/      # CI/CD pipeline definitions for GitHub Actions.
├── package.json            # Project metadata and npm scripts.
├── playwright.config.ts    # Core Playwright and framework configuration.
└── ProjectConfig.properties# Project-specific variables like URLs.
```