import type { Locator, Page } from "@playwright/test";
import expect from "@playwright/test";
import CommonActions from "../CommonActions.js";
import { getHomePageLocators, type HomePage_OR } from "./HomePage_OR.js";
import { getLoginPageLocators, type LoginPage_OR } from "../LoginPage_OR.js";
import type MenuOption from "../constants/MenuOption.js";
import { ValueAssertionType, AssertionType } from "playpom";
// import formdata from "@data/Login/Upload/formdata.json";
// import formdata from '@data/Login/Upload/formdata.json' assert { type: 'json' }
import * as fs from 'fs/promises';

export interface ViewDetails {
  ClaimNumber: string;
  INSfirstName: string;
  INSlastName: string;
  inter_FirstName: string;
  inter_LastName: string;
  DOL: string;
  IntervieweeType: string;
  Adjuster: "Arpit Desai";
  Office: "Shared Services (Codal)";
}

export default class LoginPage extends CommonActions {
  protected initialPage: Page;
  protected locators: HomePage_OR;
  protected loginLocator: LoginPage_OR;
  

  constructor(page: Page) {
    super(page);
    this.initialPage = page;
    this.locators = getHomePageLocators(page);
    this.loginLocator = getLoginPageLocators(page);
  }
  

  async navigateToUploadStatement(): Promise<void> {

    // Navigate to upload statement
    const btn_uploadStatement: Locator = this.locators.btn_uploadStatement;
    await this.UI.waitForElement(btn_uploadStatement, 30_000)
    await this.UI.clickAndVerify(btn_uploadStatement, this.locators.num_claimNumber)
  }

  async navigateToViewDetails(ClaimNumber: string): Promise<void> {

    // const formdata = await this.readJson('./data/Login/Upload/formdata.json');

    // Navigate to View Details
    const btn_viewDetails: Locator = this.locators.btn_viewDetails(ClaimNumber);
    await this.UI.waitForElement(btn_viewDetails, 30_000)
    const verify_claimNumber: Locator = this.locators.verify_claimNumber(ClaimNumber).first();
    await this.UI.clickAndVerify(btn_viewDetails, verify_claimNumber)
  }

  /**
   * verify the Login of website
   *
   * @param baseURL
   */
  async verifyLogin(): Promise<void> {
    const homeLogo: Locator = this.locators.homeLogo;
    const title: Locator = this.locators.title

    // Verify Login
    await this.UI.waitForPageLoad(3_000)
    await this.ASSERT.hardAssert(homeLogo, AssertionType.TO_BE_VISIBLE, undefined, "Home Button should be visible");
    await this.ASSERT.hardAssert(title, AssertionType.TO_BE_VISIBLE, undefined, "'Recent Statements' should be visible");

  }

  async doLogOut(): Promise<void> {

    const btn_logout: Locator = this.locators.btn_logout;
    const homeLogo: Locator = this.loginLocator.homeLogo;
    const userName: Locator = this.loginLocator.txt_userName
    await this.UI.clickAndVerify(btn_logout, homeLogo)

    // Verify Logout
    await this.ASSERT.hardAssert(homeLogo, AssertionType.TO_BE_VISIBLE, undefined, "Login Page should be visible");
    await this.ASSERT.hardAssert(userName, AssertionType.TO_BE_VISIBLE, undefined, "'User Name' should be visible");
  }

  async verifyFilledFormDetails(expectedData:ViewDetails): Promise<void> {

    // const formdata = await this.readJson('./data/Login/Upload/formdata.json');
    await this.closePopUp()
    console.log(`Claim #: ${expectedData.ClaimNumber}`)

    const verify_claimNumber: Locator = this.locators.verify_claimNumber(expectedData.ClaimNumber);
    await this.waitForClaimNumberWithRetries(verify_claimNumber, this.UI)

    // Verify Claim Number
    await this.UI.refreshPage()
    await this.UI.waitForElement(verify_claimNumber, 30_000)
    console.log("Claim Number is: " + verify_claimNumber.textContent())
    console.log(`Claim #: ${expectedData.ClaimNumber}`)
    await this.ASSERT.hardAssert(verify_claimNumber, AssertionType.TO_HAVE_TEXT, `Claim #: ${expectedData.ClaimNumber}`, "'Claim Number' should match");

    // Verify Interviewee
    const verify_interviewee: Locator = this.locators.verify_interviewee(expectedData.ClaimNumber);
    await this.UI.waitForElement(verify_interviewee, 30_000)
    const fullInterviewee = `${expectedData.inter_FirstName} ${expectedData.inter_LastName}`
    const Full_Interviewee_Promise = await verify_interviewee.textContent();
    const Full_Interviewee = await Full_Interviewee_Promise.split('Interviewee:')[1]?.trim();
    await this.ASSERT.hardAssertValue(fullInterviewee, ValueAssertionType.TO_BE, Full_Interviewee, "'Interviewee Name' should match");

    /*// Verify Insured
    const verify_others: Locator = this.locators.verify_others;
    await this.UI.waitForElement(verify_interviewee, 30_000)
    const fullInsured = `${formdata.INSfirstName} ${formdata.INSlastName}`
    const Full_Insured_Promise = await verify_others.textContent();
    const Full_Insured = await Full_Insured_Promise.split('Insured:')[1]?.trim();
    await this.ASSERT.hardAssertValue(fullInsured, ValueAssertionType.TO_BE, Full_Insured, "'Insured Name' should match");*/

    // Verify DOI
    const DOI = await expectedData.DOL
    const originalDate = new Date(DOI); // This is "November 28, 2025" in UTC/browser time

    // 3. Format the original Date to "Month DD, YYYY"
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    // Use originalDate instead of adjustedDate
    const formattedDate = originalDate.toLocaleDateString('en-US', options);
    console.log(formattedDate); // Expected Output: November 28, 2025

    // The final outputString will be "DOI: November 28, 2025"
    const outputKey = "DOI";
    const outputString = `${outputKey}: ${formattedDate}`
    const verify_others: Locator = this.locators.verify_others(expectedData.ClaimNumber);
    const DOI_Promise = await verify_others.textContent();
    const DOI_Insured = await DOI_Promise.split('DOI:')[1]?.trim();
    console.log("Date is: " + DOI_Insured)
    await this.ASSERT.hardAssertValue(DOI_Insured, ValueAssertionType.TO_BE, formattedDate, "'Insured Name' should match");

  }

  async closePopUp(): Promise<void> {
    const closePopUp: Locator = this.locators.closePopUp;
    await this.UI.waitForElement(closePopUp, 30_000)
    await this.UI.click(closePopUp)
  }

  /**
 * Tries to verify the claim number element is visible, refreshing the page 
 * up to a maximum of 5 times.
 * @param {Locator} verifyClaimNumber - The Playwright Locator for the element.
 * @param {Object} UI - An object containing the refreshPage method (e.g., this.UI).
 */
  async waitForClaimNumberWithRetries(verifyClaimNumber, UI) {
    const MAX_RETRIES = 5;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      // 1. Check if the element is visible
      if (await verifyClaimNumber.isVisible()) {
        console.log(`✅ Claim number is visible on attempt ${attempt}.`);
        return true; // Success! Exit the function/loop
      }

      // 2. If it's not visible and we are NOT on the last attempt, refresh and continue
      if (attempt < MAX_RETRIES) {
        console.log(`❌ Element not found on attempt ${attempt}. Refreshing page...`);
        await UI.refreshPage();
      } else {
        console.error(`🚨 Element not visible after ${MAX_RETRIES} attempts. Giving up.`);

        return false;
      }
    }
  }

}