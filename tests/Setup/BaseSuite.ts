import { type Page } from "playpom";
import { expect } from "@playwright/test";
import test from "playpom/playpom/base/test/IterationsTest.js";
import path from "path";
import fs from "fs"; // Import Node.js 'fs' module
import { AssertionType } from "playpom";

// Define the filename for the pre-login state
const PRE_LOGIN_STATE_FILE = path.join(
  process.cwd(),
  "playwright",
  "preLoginState.json",
);

// Define extended type
type ExtendedTest = typeof test & {
  iterate: typeof test.iterate;
};

// Define a new fixture for the pre-login state file path
const baseFixtures = test.extend<{
  preLoginStateFile: string;
}>({
  preLoginStateFile: [
    // Use an array to define the value and the scope
    PRE_LOGIN_STATE_FILE,
    { scope: "test", auto: true }, // 'worker' scope ensures it's created once per worker
  ],
});

///### Define project test with iteration feature ///
const rawProjectTest = baseFixtures.extend<{ page: Page }>({
  page: async ({ page, context, preLoginStateFile }, use) => {
    // Check if the pre-login state file exists
    if (fs.existsSync(preLoginStateFile)) {
      // Load the state from the file
      await context.storageState({ path: preLoginStateFile });
    } else {
      // --- Perform initial pre-login setup here (e.g., dismissing banners) ---
      // Example: Go to the base URL and dismiss a cookie banner
      // await page.goto("/");
      // await page.click("#cookie-accept-button");

      // Save the context state after the initial setup
      await context.storageState({ path: preLoginStateFile });
    }

    await use(page);
  },
}) as ExtendedTest;

// Reattach iterate
(rawProjectTest as any).iterate = test.iterate.bind(rawProjectTest);

// #IMP# - To be used for the scenarios needs to be performed before login
export const projectTest = rawProjectTest;

///### Define authenticated test with iteration feature ///
// NOTE: This test extends projectTest, so the pre-login state is already loaded/saved.
const rawAuthenticatedTest = projectTest.extend<
  {},
  { workerStorageState: string }
>({
  storageState: ({ workerStorageState }, use) => {
    // 'workerStorageState' holds the path to the auth file
    return use(workerStorageState);
  },

  workerStorageState: [
    async ({ browser }, use) => {
      // Use parallelIndex as a unique identifier for each worker.
      // This ensures each parallel worker has its own independent login session.
      const workerIndex = test.info().parallelIndex;

      // async ({ page, DECRYPT, context, logger }, use) => {
      // Define a separate login state file (optional, but good practice)
      // const AUTH_STATE_FILE = path.join(process.cwd(), 'playwright', 'authState.json');
      const fileName = path.resolve(
        "./playwright",
        `.auth/worker-${workerIndex}.json`,
      );

      // Check if the auth state file already exists

      // IMPORTANT: Authenticate in a clean environment by unsetting storage state.
      // This ensures the login is not affected by any previous runs.
      const page = await browser.newPage();

      //  if (fs.existsSync(fileName) && page.getByText("Your session has timed out, please log in again").waitFor({ state: "attached", timeout:3000 })) {
      //   console.log(`Worker ${workerIndex}: Reusing existing login state from ${fileName}`);
      //   await use(fileName); // Pass the existing file path to the storageState fixture
      //   return;
      // }

      console.log(`Worker ${workerIndex}: Performing one-time login...`);

      // **TODO: ADD YOUR LOGIN LOGIC HERE**
      // Example:
      // await page.goto("/login");
      // await page.fill("#username", "myUser");
      // await page.fill("#password", DECRYPT("encryptedPassword"));
      // await page.click("#login-button");
      // await page.waitForURL("/dashboard");

      await page.goto("https://salish-qa.xyz.n2uitive.com/login?redirectTo=/");

      const txt_username = page.locator("[name='username']");
      const txt_password = page.locator("[name='password']");
      const btn_login = page.getByTestId("login-button");

      await txt_username.fill("adesai@codal.com");
      await txt_password.fill("Codal@123");
      await btn_login.click();
      const homeLogo = page.locator("[alt='site logo']").first();
      await expect(homeLogo).toBeVisible();
      // await ASSERT.hardAssert(homeLogo, AssertionType.TO_BE_VISIBLE, undefined, "Home Button should be visible");

      console
        .log
        // `--- Ending Login Fixture Teardown for user: ${username} ---`
        ();

      // 3. Save the full authenticated context state
      // await context.storageState({ path: AUTH_STATE_FILE });
      await page.context().storageState({ path: fileName });
      console.log(`Worker ${workerIndex}: Login state saved to ${fileName}`);
      // Close the temporary page used for login
      await page.close();

      // Pass the new file path to the actual tests
      await use(fileName);
    },
    {
      scope: "worker", // Runs once per worker process (i.e., once for a set of parallel tests)
      auto: true,
    },
  ],
});

// Reattach iterate again
(rawAuthenticatedTest as any).iterate = test.iterate.bind(rawAuthenticatedTest);

/// #IMP# - To be used for the scenarios needs to be performed after login
export const authenticatedTest = rawAuthenticatedTest;
