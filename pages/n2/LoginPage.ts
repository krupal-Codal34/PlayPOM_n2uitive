import type { Locator, Page } from "@playwright/test";
import CommonActions from "./CommonActions.js";
import { getLoginPageLocators, type LoginPage_OR } from "./LoginPage_OR.js";
import { Strings } from "./constants/Strings.js";
import { AssertionType, ValueAssertionType } from "playpom";
import {Timeout} from "./constants/Timeout.js"

export default class LoginPage extends CommonActions {
  protected initialPage: Page;
  protected locators: LoginPage_OR;

  constructor(page: Page) {
    super(page);
    this.initialPage = page;
    this.locators = getLoginPageLocators(page);
  }

  /**
   * To launch and verify the automation exercise website
   *
   * @param baseURL
   */
  async launch(baseURL: string) {
    const currentURL: string = this.initialPage.url();

    if (currentURL.length > 0 && currentURL === baseURL) {
      this.logger.log("debug", `Already navigated to given URL - ${baseURL}`);
    } else {
      await this.UI.navigateAndVerify(baseURL, this.locators.homeLogo);
    }
  }

  /**To do Valid Login
   *
   * @param Enter Valid User Name
   * @param Enter Valid Password
   */
  async doLogin(username: string, password: string) {

    const txt_username: Locator = this.locators.txt_userName;
    const txt_password: Locator = this.locators.txt_password;
    const btn_login: Locator = this.locators.btn_login;

    await this.UI.waitForElement(txt_username, Timeout.High)
    await this.UI.waitForElementToBe(txt_username, 'attached',Timeout.High)
    await txt_username.fill(username);
    await txt_password.fill(password);
    await this.UI.waitForElementToBe(btn_login, 'visible',Timeout.High)
    await this.UI.click(btn_login);
  }

  /**To do InValid Login with invalid Password
   *
   * @param Enter Valid User Name
   * @param Enter Invalid Password
   */

  async loginWithInvalidPassword(username: string, invalidPassword: string) {
    // Use the core action method
    await this.doLogin(username, invalidPassword);

    // Verification step (expects failure)
    const errorLocator: Locator = this.locators.errorLocator;
    await errorLocator.waitFor({ state: 'visible' });

    // Verify Error Message
    const error_AMessage = Strings.INVALIDCREDS
    const error_EMessage: string | null = await errorLocator.textContent();
    await this.ASSERT.hardAssertValue(error_AMessage, ValueAssertionType.TO_BE, error_EMessage, "Verification of Error Message of InValid Password");
  }

  /**To do InValid Login with invalid Password
    *
    * @param Enter Invalid Email
    * @param Enter Valid Password
    */

  async loginWithUnregisteredUser(unregisteredUser: string, password: string) {
    // Use the core action method
    await this.doLogin(unregisteredUser, password);

    // Verification step (expects failure)
    const errorLocator: Locator = this.locators.errorLocator;
    await errorLocator.waitFor({ state: 'visible' });

    // Verify Error Message
    const error_AMessage = Strings.INVALIDCREDS
    const error_EMessage: string | null = await errorLocator.textContent();
    await this.ASSERT.hardAssertValue(error_AMessage, ValueAssertionType.TO_BE, error_EMessage, "Verification of Error Message of Unregistered Email");
  }

  /**To do InValid Login with invalid Password
     *
     * @param Empty UserName
     * @param Empty Password
     */

  async loginWithEmptyCredentials() {
    // Use the core action method with empty strings
    await this.doLogin('', '');

    // Verification step (expects failure)
    const errorLocatorEmail: Locator = this.locators.emptyUserName;
    const errorLocatorPassword: Locator = this.locators.emptyPassword;
    await errorLocatorEmail.waitFor({ state: 'visible' });
    await errorLocatorPassword.waitFor({ state: 'visible' });

    // Verify Validation Messages
    const valid_AMessageEmail = Strings.EMPTYUSERNAME
    const valid_EMessageEmail: string | null = await errorLocatorEmail.textContent();

    await this.ASSERT.hardAssertValue(valid_AMessageEmail, ValueAssertionType.TO_BE, valid_EMessageEmail, "Verification of Validation Message of Email");

    const valid_AMessagePassword = Strings.EMPTYPASSWORD
    const valid_EMessagePassword: string | null = await errorLocatorPassword.textContent();

    await this.ASSERT.hardAssertValue(valid_AMessagePassword, ValueAssertionType.TO_BE, valid_EMessagePassword, "Verification of Validation Message of Password");
  }

}