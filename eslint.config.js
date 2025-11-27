import typescript from "@typescript-eslint/eslint-plugin";
import playwright from "eslint-plugin-playwright";
import typescriptParser from "@typescript-eslint/parser";
import pluginUnusedImports from "eslint-plugin-unused-imports";
const { configs: typescriptConfigs } = typescript;

const prefixes = ["@HEALTHCHECK", "@UNIT", "@REGRESSION", "@SANITY", "@CRITICAL", "@UI", "@API", "@PERF"];
const prefixesPattern = prefixes.map((p) => `(?:${p})`).join("|");
// test: optional prefix followed by capital letter
const testTitlePattern = `^(?:(${prefixesPattern})\\s*)?[A-Z]`;
// describe: must start with capital letter
const describeTitlePattern = `^[A-Z]`;

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": typescript,
      playwright: playwright,
      "unused-imports": pluginUnusedImports,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      ...typescriptConfigs.recommended.rules,
      ...playwright.configs["flat/recommended"].rules,
      "no-console": "warn",
      "prefer-const": "error",
      "@typescript-eslint/no-explicit-any": "off",
      // ✅ Main rule for unused variables/args
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      // https://github.com/playwright-community/eslint-plugin-playwright/tree/main/docs/rules
      "playwright/no-skipped-test": "warn",
      "playwright/no-focused-test": "warn",
      "playwright/no-force-option": "off",
      "playwright/missing-playwright-await": "error",
      "playwright/no-duplicate-hooks": "error",
      "playwright/no-conditional-in-test": "warn",
      "playwright/no-element-handle": "error",
      "playwright/no-force-option": "warn",
      "playwright/no-nested-step": "error",
      "playwright/no-nth-methods": "warn",
      "playwright/no-slowed-test": "warn",
      "playwright/no-unsafe-references": "error",
      "playwright/no-useless-await": "error",
      "playwright/no-useless-not": "error",
      "playwright/prefer-hooks-on-top": "error",
      "playwright/prefer-locator": "error",
      "playwright/expect-expect": "off",
      "playwright/require-top-level-describe": ["warn", { maxTopLevelDescribes: 2 }],
      "playwright/valid-describe-callback": "error",
      "playwright/no-networkidle": "warn",
      "playwright/valid-title": [
        "error",
        {
          mustMatch: {
            describe: [new RegExp(describeTitlePattern, "u").source, "Describe title must start with a capital letter"],
            test: [
              new RegExp(testTitlePattern, "u").source,
              `Test title must start with a capital letter, optionally after one of these tags: ${prefixes.join(", ")}`,
            ],
          },
        },
      ],

      // ✅ Keep only this for removing unused imports
      "unused-imports/no-unused-imports": "warn",
    },
  },
];
