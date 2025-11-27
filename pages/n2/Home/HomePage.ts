import type { Locator, Page } from "@playwright/test";
import  expect  from "@playwright/test";
import CommonActions from "../CommonActions.js";
import { getHomePageLocators, type HomePage_OR } from "./HomePage_OR.js";
import { getLoginPageLocators, type LoginPage_OR } from "../LoginPage_OR.js";
import type MenuOption from "../constants/MenuOption.js";
import { AssertionType } from "playpom";


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

  /**
   * To launch and verify the automation exercise website
   *
   * @param baseURL
   */
  async verifyLogin(): Promise<void> {
    const homeLogo: Locator = this.locators.homeLogo;
    const title:Locator = this.locators.title

    // Verify Login
    await this.UI.waitForPageLoad(3_000)
    await this.ASSERT.hardAssert(homeLogo, AssertionType.TO_BE_VISIBLE, undefined, "Home Button should be visible");
    await this.ASSERT.hardAssert(title, AssertionType.TO_BE_VISIBLE, undefined, "'Recent Statements' should be visible");

  }

  async doLogOut():Promise<void> {

    const btn_logout: Locator = this.locators.btn_logout;
    const homeLogo: Locator = this.loginLocator.homeLogo;
    const userName:Locator = this.loginLocator.txt_userName
    await  this.UI.clickAndVerify(btn_logout, homeLogo)

    // Verify Logout
    await this.ASSERT.hardAssert(homeLogo, AssertionType.TO_BE_VISIBLE, undefined, "Login Page should be visible");
    await this.ASSERT.hardAssert(userName, AssertionType.TO_BE_VISIBLE, undefined, "'User Name' should be visible");
  }

async navigateToUploadStatement():Promise<void> {

  // Navigate to upload statement
  const btn_uploadStatement: Locator = this.locators.btn_uploadStatement;
  await this.UI.waitForElement(btn_uploadStatement, 30_000)
  await this.UI.clickAndVerify(btn_uploadStatement, this.locators.num_claimNumber)
}

}