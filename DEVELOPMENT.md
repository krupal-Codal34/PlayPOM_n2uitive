# PlayPOM Template - Development Guide

This guide covers advanced usage and development workflows for the PlayPOM Template project.

## 🚀 Quick Start Scripts

### Basic Test Execution

```bash
npm test                    # Run all tests
npm run test:headed         # Run with browser visible
npm run test:debug          # Run in debug mode
npm run test:ui             # Run with Playwright UI
```

### Browser-Specific Testing

```bash
npm run test:chrome         # Chrome only
npm run test:firefox        # Firefox only
npm run test:safari         # Safari only
npm run test:all-browsers   # All browsers
```

### Test Categories

```bash
npm run test:smoke          # Smoke tests (@smoke tag)
npm run test:regression     # Regression tests (@regression tag)
npm run test:api            # API tests only
npm run test:login          # Login tests only
```

### Advanced Test Runner

```bash
# Custom test execution with advanced options
npm run run-tests -- --browser chrome --headed --tag @smoke
npm run run-tests -- --file tests/login.spec.ts --debug
npm run run-tests -- --workers 4 --retries 2 --timeout 60000
```

## 📊 Reporting & Analysis

### Generate Reports

```bash
npm run report              # HTML report
npm run generate-report -- --type html --open
npm run generate-report -- --type json
npm run generate-report -- --type junit
```

### View Reports

- **HTML Report**: `generated/reports/HTML_Report/index.html`
- **JSON Report**: `generated/reports/execution_results.json`
- **Logs**: `generated/logs/`

## 🔧 Development Tools

### Code Generation

```bash
npm run codegen             # Record new tests
npm run codegen:url         # Record from specific URL
npm run inspector           # Debug with inspector
```

### Environment Management

```bash
npm run manage-env list     # List environments
npm run manage-env switch staging  # Switch to staging
npm run manage-env current  # Show current environment
```

### Test Data Management

```bash
npm run manage-data list    # List test data files
npm run manage-data validate # Validate data files
npm run manage-data create MyTest --type json
```

## 🏗️ Project Structure for Development

### Adding New Tests

1. **Create Page Object** in `pages/`
2. **Create Test Spec** in `tests/`
3. **Add Test Data** in `Data/`
4. **Update Configuration** if needed

### Page Object Example

```typescript
// pages/NewPage.ts
import { BasePage } from "playpom";
import type { Page, Locator } from "playpom/types";

export class NewPage extends BasePage {
  private readonly element: Locator;

  constructor(page: Page) {
    super(page);
    this.element = page.locator("#element");
  }

  async performAction(): Promise<void> {
    await this.WEB.clickElement(this.element, "Element description");
  }
}
```

### Test Spec Example

```typescript
// tests/new-feature.spec.ts
import { BaseTest } from "playpom";
import { NewPage } from "@pages/NewPage";

class NewFeatureTest extends BaseTest {
  private newPage: NewPage;

  async setup(): Promise<void> {
    this.newPage = new NewPage(this.page);
  }

  async testNewFeature(): Promise<void> {
    await this.newPage.performAction();
    // Add assertions
  }
}

const test = new NewFeatureTest();
test.describe("New Feature Tests", () => {
  test.beforeEach(async () => await test.setup());
  test.test("should test new feature", async () => await test.testNewFeature());
});
```

## 🔄 Continuous Integration

### CI/CD Scripts

```bash
# For CI environments
npm run test:parallel       # Parallel execution
npm run test:retry          # With retries
npm run clean && npm test   # Clean run
```

### Environment Variables

```bash
# Set environment for tests
set TEST_ENV=staging
npm test

# Set browser
set BROWSER=firefox
npm test
```

## 🧪 Testing Strategies

### Test Organization

- **Smoke Tests**: Critical path tests tagged with `@smoke`
- **Regression Tests**: Full test suite tagged with `@regression`
- **API Tests**: Backend API validation
- **UI Tests**: Frontend user interface testing
- **Data-Driven Tests**: Excel/JSON based test data

### Test Data Strategy

- **Properties Files**: Configuration and static data
- **JSON Files**: Structured test data and test cases
- **Excel Files**: Data-driven test scenarios
- **Environment Configs**: Environment-specific settings

### Assertion Strategy

```typescript
// Hard assertions (fail fast)
await this.ASSERT.hardAssert(element, AssertionType.TO_BE_VISIBLE);

// Soft assertions (continue on failure)
await this.ASSERT.softAssert(
  element,
  AssertionType.TO_CONTAIN_TEXT,
  "expected",
);

// Value assertions
await this.ASSERT.hardAssertValue(
  actualValue,
  ValueAssertionType.TO_BE,
  expectedValue,
);
```

## 🔍 Debugging & Troubleshooting

### Debug Mode

```bash
npm run test:debug          # Step through tests
npm run dev:debug           # Development debugging
```

### Trace Analysis

```bash
npm run test:trace          # Record traces
# View traces in Playwright UI
```

### Common Issues

1. **Element Not Found**: Check selectors and wait conditions
2. **Timeout Issues**: Increase timeouts in config
3. **Data Issues**: Validate test data files
4. **Environment Issues**: Check environment configuration

### Logging

- Test logs: `generated/logs/test-logs/`
- Global logs: `generated/logs/global.log`
- Custom logging available in all test classes

## 📦 Package Management

### Update PlayPOM Framework

```bash
npm run update-playpom      # Copy latest dist from PlayPOM
npm run validate            # Validate installation
```

### Dependencies

- Keep `@playwright/test` version aligned with PlayPOM
- Update browser versions regularly
- Monitor security updates

## 🎯 Best Practices

### Code Organization

- One page object per page/component
- Group related tests in describe blocks
- Use meaningful test and method names
- Keep test data external

### Performance

- Use parallel execution for independent tests
- Optimize selectors for speed
- Minimize browser operations
- Use appropriate wait strategies

### Maintainability

- Regular code reviews
- Consistent naming conventions
- Documentation for complex logic
- Version control for test data

### Reliability

- Stable selectors (avoid dynamic IDs)
- Proper error handling
- Retry mechanisms for flaky tests
- Environment isolation

## 🔧 Advanced Configuration

### Custom Reporters

Add custom reporters in `playwright.config.ts`:

```typescript
reporter: [
  ["html"],
  ["json", { outputFile: "results.json" }],
  ["./custom-reporter.js"],
];
```

### Global Setup/Teardown

Configure in `playwright.config.ts`:

```typescript
globalSetup: require.resolve('./global-setup'),
globalTeardown: require.resolve('./global-teardown')
```

### Custom Fixtures

Create reusable test fixtures for common setup.

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [PlayPOM Framework Guide](../PlayPOM/README.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
