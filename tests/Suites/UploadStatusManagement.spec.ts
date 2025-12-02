// ============================================================================
// Test Suite: File Upload & Form Submission Status Management
// Author: <Krupalsinh Chavda>
// Standard: TypeScript + Playwright International Automation Coding Guidelines
// ============================================================================

// Page Objects
import MenuOption from "@pages/n2/constants/MenuOption.js"; // unused? consider removing
import LoginPage from "@pages/n2/LoginPage.js";
import HomePage from "@pages/n2/Home/HomePage.js";
import UploadStatement from "@pages/n2/Home/UploadFiles/UploadStatement.js";
import ViewPage from "@pages/n2/Home/View/ViewPage.js";
import CommonActions from "@pages/n2/CommonActions.js";

// Base test setup
// import { projectTest as test } from "@tests/Setup/BaseSuite.js";
import { authenticatedTest as test } from "@tests/Setup/BaseSuite.js";

// Node utilities
import { fileURLToPath } from "url";
import * as path from "path";

// ----------------------------------------------------------------------------
// Global strongly-typed objects (initialized in beforeEach)
// ----------------------------------------------------------------------------
let loginPage: LoginPage;
let homePage: HomePage;
let uploadStatement: UploadStatement;
let viewPage: ViewPage;
let commonActions: CommonActions;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------------------------------------------------------------
// File Constants (kept DRY & clean)
// ----------------------------------------------------------------------------
const FILES = {
  TXT: "sample.txt",
  PDF: "sample.pdf",
  DOC: "sample.doc",
  MP3: "Complete_convo.mp3",
};

// Utility: resolves any file from /Data/Login/Upload directory
// ✅ UPDATED: Added helper to remove repeated path.join everywhere.
const resolveUploadFile = (fileName: string): string =>
  path.join(__dirname, "..", "..", "Data", "Login", "Upload", fileName);

// ============================================================================
// Main Test Suite
// ============================================================================
test.describe(
  "Test Suite: File Upload and Form Submission Status Management",
  { tag: "@SANITY" },
  () => {
    // ====================================================================
    // Before Each: Login & Navigate to app
    // ====================================================================
    test.beforeEach(async ({ page, INPUT, logger }) => {
      // Page object initialization
      // ✅ UPDATED: strong typing & clarity
      loginPage = new LoginPage(page);
      homePage = new HomePage(page);
      uploadStatement = new UploadStatement(page);
      viewPage = new ViewPage(page);
      commonActions = new CommonActions(page);

      logger.log("debug", `[Loading] All Page Objects`);

      /* // Launch app
            
            await loginPage.launch(INPUT.getInput("baseURL"));
            await loginPage.doLogin(INPUT.getInput("username"), INPUT.getInput("password"));*/

      await page.goto(INPUT.getInput("homeURL"));
    });

    // ====================================================================
    // 001_ INVALID FILE FORMAT TEST
    // ====================================================================
    test("@CRITICAL Should reject invalid file formats and show validation", async ({
      page,
    }) => {
      await test.step("Navigate to Upload Statements module", async () => {
        await homePage.navigateToUploadStatement();
      });

      await test.step("Upload invalid file formats", async () => {
        // TXT
        await uploadStatement.validateInvalidfile(resolveUploadFile(FILES.TXT));

        // PDF
        await uploadStatement.validateInvalidfile(resolveUploadFile(FILES.PDF));

        // DOC
        await uploadStatement.validateInvalidfile(resolveUploadFile(FILES.DOC));
      });
    });

    // ====================================================================
    // 002_ VALID FILE UPLOAD TEST
    // ====================================================================
    test("@CRITICAL Should upload valid MP3 file and pass validation", async ({
      page,
    }) => {
      await test.step("Navigate to Upload Statements module", async () => {
        await homePage.navigateToUploadStatement();
      });

      await test.step("Upload valid MP3 file", async () => {
        await uploadStatement.uploadFile(resolveUploadFile(FILES.MP3));
        await uploadStatement.validateValidFile();
      });
    });

    // ====================================================================
    // 003_ FULL FORM SUBMISSION FLOW
    // ====================================================================
    test("@SANITY Should upload file, fill form & verify required field validations", async ({
      page,
      INPUT,
    }) => {
      await test.step("Navigate to Upload Statements module", async () => {
        await homePage.navigateToUploadStatement();
      });

      await test.step("Upload a valid file", async () => {
        await uploadStatement.uploadFile(resolveUploadFile(FILES.MP3));
        await uploadStatement.validateValidFile();
      });

      await test.step("Fill out the form with required details", async () => {
        await uploadStatement.fillForm(page);
      });

      await test.step("Verify filled form details", async () => {
        const formdata = INPUT.getAllJsonData();
        const jsonData = JSON.parse(formdata);
        await homePage.verifyFilledFormDetails(jsonData);
      });

      await test.step("Verify More details", async () => {
        await homePage.navigateToViewDetails(INPUT.getJsonValue("ClaimNumber"));
        const formdata = INPUT.getAllJsonData();
        const jsonData = JSON.parse(formdata);
        await viewPage.verifyDetails(jsonData, resolveUploadFile(FILES.MP3));
      });
    });
  },
);
