// import { getProjectRoot } from "@lib/commons"; // for getting the root of the project to generate paths
import { defineConfig, devices } from "@playwright/test";
import type { OrtoniReportConfig } from "ortoni-report";

// for cleaning before the execution
const coreSetup = "playpom/playpom/hooks/global-setup.js";
// for after execution completion actions
const coreTeardown = "playpom/playpom/hooks/global-teardown.js";

import os from "os";
import PlayPOMReporter from "playpom";
import type { PlayPOMConfig } from "playpom";

// for the ortino html report
const reportConfig: OrtoniReportConfig = {
  open: "never", // default to never
  folderPath: "./generated/reports/ortoni-html",
  filename: "report.html",
  logo: "gocodal.jpg",
  title: "MCCPD Test Automation POC Execution Report",
  showProject: true,
  projectName: "MCCPD-Test-Automation",
  testType: "e2e",
  authorName: os.userInfo().username,
  base64Image: false,
  stdIO: true,
  meta: {
    Framework: "PlayPOM",
    version: "06182025",
    description: "This test automation execution contains the UI Functional verification scenarios for the POC",
    release: "1.0.0",
    platform: os.type(),
  },
};

/** For our custom framework PlayPOM */

export const playPOMConfig: PlayPOMConfig = {
  notificationFromEmail: process.env.notificationFromEmail || "<local_update_notification_email>",
  notificationFromPwd: process.env.notificationFromPwd || "<local_update_notification_pwd>",
  // sendEmailAddresses - if we don't want to have the email, have the empty array for it
  sendEmailAddresses: JSON.parse(process.env.sendEmailAddressesArray ?? "null") || [
    "playpom-test-executio-aaaaqt6tb5gjnv2d3eiluxt7vi@codal.slack.com",
  ], // it will notify the core team
};

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // for cleaning before the execution
  globalSetup: coreSetup,
  // for sending email and slack notification after the execution
  globalTeardown: coreTeardown,

  testDir: "./tests/Suites",
  // testMatch: ["**/practice_test_automation.spec.ts", "**/automation_exercise.spec.ts"],

  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 0 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["html", { outputFolder: "./generated/reports/HTML_Report" }],
    ["json", { outputFile: "./generated/reports/execution_results.json" }],
    ["playpom", PlayPOMReporter],
    ["ortoni-report", reportConfig],
  ],
  /*  timeout for each test in milliseconds. This is the maximum time a test can run before it is marked as failed. */
  timeout: 0, // 0 means no timeout for the test execution

  expect: {
    timeout: 20000, // Example: sets expect timeout to 10 seconds
  },

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* action timeout is the maximum time each action such as `click()` or `goto()` can take before being aborted. */
    actionTimeout: 7 * 1000, // 7s
    /* navigation timeout is the maximum time for navigation actions such as `goto()` or `waitForNavigation()`. */
    navigationTimeout: 30 * 1000, // 30s

    // Slow down actions by 500ms
    launchOptions: {
      args: ["--start-maximized"],
      slowMo: 500,  
    },

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on",
    screenshot: "on",
    colorScheme: "light",
    video: "on",
    viewport: { width: 1920, height: 1080 }, // for maximizing effect
  },
  /** for the files created during the execution */
  outputDir: "./generated/result_files",

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: ['--start-maximized'], 
        },
        // Tell Playwright to use the full size of the maximized window
        // viewport: null,
      },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
