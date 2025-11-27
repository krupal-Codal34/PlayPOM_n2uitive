import { type Page } from "playpom";
import {expect} from "@playwright/test";
import test from "playpom/playpom/base/test/IterationsTest.js";
import path from "path";
import fs from "fs"; // Import Node.js 'fs' module
import { AssertionType} from "playpom";


// Define the filename for the pre-login state
const PRE_LOGIN_STATE_FILE = path.join(process.cwd(), 'playwright', 'preLoginState.json');

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
        { scope: 'test', auto: true } // 'worker' scope ensures it's created once per worker
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
const rawAuthenticatedTest = projectTest.extend<{ page: Page }>({
  page: async ({ page, DECRYPT, context, logger }, use) => {
    // Define a separate login state file (optional, but good practice)
    const AUTH_STATE_FILE = path.join(process.cwd(), 'playwright', 'authState.json');

    // 1. Check if the full authenticated state exists
    if (fs.existsSync(AUTH_STATE_FILE)) {
      // Load the authenticated state directly (this will override the pre-login state)
      await context.storageState({ path: AUTH_STATE_FILE });
      
    } else {
      // 2. Perform login since the state is not found
      logger.info('Performing login and saving authenticated state...');

      // **TODO: ADD YOUR LOGIN LOGIC HERE**
      // Example:
      // await page.goto("/login");
      // await page.fill("#username", "myUser");
      // await page.fill("#password", DECRYPT("encryptedPassword"));
      // await page.click("#login-button");
      // await page.waitForURL("/dashboard");

      await page.goto('https://salish-qa.xyz.n2uitive.com/login?redirectTo=/')

      const txt_username  = page.locator("[name='username']");
      const txt_password  = page.locator("[name='password']");
      const btn_login = page.getByTestId("login-button");

      await txt_username.fill('adesai@codal.com');
      await txt_password.fill('Codal@123');
      await btn_login.click();
      const homeLogo = page.locator("[alt='site logo']").first();
      await expect(homeLogo).toBeVisible();
      // await ASSERT.hardAssert(homeLogo, AssertionType.TO_BE_VISIBLE, undefined, "Home Button should be visible");



      // 3. Save the full authenticated context state
      await context.storageState({ path: AUTH_STATE_FILE });
    }

    await use(page);
  },
}) as ExtendedTest;

// Reattach iterate again
(rawAuthenticatedTest as any).iterate = test.iterate.bind(rawAuthenticatedTest);

/// #IMP# - To be used for the scenarios needs to be performed after login
export const authenticatedTest = rawAuthenticatedTest;