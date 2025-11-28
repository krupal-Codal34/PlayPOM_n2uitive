/**
 * @file LoginSuite.spec.ts
 * @description
 * Test suite covering all Login-related scenarios:
 *  - Successful login
 *  - Successful login + logout
 *  - Login with invalid password
 *  - Login with unregistered email
 *  - Login with empty credentials
 */

import MenuOption from "@pages/n2/constants/MenuOption.js";
import LoginPage from "@pages/n2/LoginPage.js";
import HomePage from "@pages/n2/Home/HomePage.js";
import { projectTest as test } from "@tests/Setup/BaseSuite.js";

// Shared object handles
let loginPage: LoginPage;
let homePage: HomePage;

// -------------------------------------------------------------
// Test Suite: Login Scenarios
// -------------------------------------------------------------
test.describe(
  "Login Scenarios Verification",
  { tag: "@SANITY" },
  () => {

    // ---------------------------------------------------------
    // Scenario 001: Successful Login
    // ---------------------------------------------------------
    test("@UI Successful Login into system", async ({ page, INPUT }) => {

      await test.step("Launch application & enter valid credentials", async () => {
        loginPage = new LoginPage(page);
        await loginPage.launch(INPUT.getInput("baseURL"));
        await loginPage.doLogin(
          INPUT.getInput("username"),
          INPUT.getInput("password")
        );
      });

      await test.step("Verify successful login", async () => {
        homePage = new HomePage(page);
        await homePage.verifyLogin();
      });
    });

    // ---------------------------------------------------------
    // Scenario 002: Login + Logout
    // ---------------------------------------------------------
    test("@UI Successful Login and Logout", async ({ page, INPUT }) => {

      await test.step("Launch application & login", async () => {
        loginPage = new LoginPage(page);
        await loginPage.launch(INPUT.getInput("baseURL"));
        await loginPage.doLogin(
          INPUT.getInput("username"),
          INPUT.getInput("password")
        );
      });

      await test.step("Verify login page", async () => {
        homePage = new HomePage(page);
        await homePage.verifyLogin();
      });

      await test.step("Logout from system", async () => {
        await homePage.doLogOut();
      });
    });

    // ---------------------------------------------------------
    // Scenario 003: Invalid Password Login Attempt
    // ---------------------------------------------------------
    test("@UI Login with Invalid Password", async ({ page, INPUT }) => {

      await test.step("Attempt login using invalid password", async () => {
        loginPage = new LoginPage(page);
        await loginPage.launch(INPUT.getInput("baseURL"));
        await loginPage.loginWithInvalidPassword(
          INPUT.getInput("username"),
          INPUT.getInput("invalidPassword")
        );
      });
    });

    // ---------------------------------------------------------
    // Scenario 004: Login with Unregistered Email
    // ---------------------------------------------------------
    test("@UI Login with Unregistered Email", async ({ page, INPUT }) => {

      await test.step("Attempt login with unknown/unregistered user", async () => {
        loginPage = new LoginPage(page);
        await loginPage.launch(INPUT.getInput("baseURL"));
        await loginPage.loginWithUnregisteredUser(
          INPUT.getInput("unregisteredemail"),
          INPUT.getInput("password")
        );
      });
    });

    // ---------------------------------------------------------
    // Scenario 005: Login with Empty Credentials
    // ---------------------------------------------------------
    test("@UI Login with Empty Credentials", async ({ page,INPUT }) => {

      await test.step("Attempt login with empty username/password", async () => {
        loginPage = new LoginPage(page);
        await loginPage.launch(INPUT.getInput("baseURL"));
        await loginPage.loginWithEmptyCredentials();
      });
    });
  }
);
