import type { Locator, Page } from "@playwright/test";
import CommonActions from "../CommonActions.js";

export interface HomePage_OR {
  homeLogo: Locator;
  txt_userName: Locator;
  txt_password: Locator;
  btn_login: Locator;
  title: Locator;
  btn_logout: Locator;
  btn_uploadStatement: Locator;
  uploadFile: Locator;
  num_claimNumber: Locator;
  


  // Dynamic locators (functions)
  verify_claimNumber: (claimNumber: string) => Locator;
  verify_interviewee: (claimNumber: string) => Locator;
  verify_others: (claimNumber: string) => Locator;
  btn_viewDetails: (claimNumber: string) => Locator;

  closePopUp: Locator;
}

export function getHomePageLocators(page: Page): HomePage_OR {
  const commonActions = new CommonActions(page);

  return {
    homeLogo: page.locator("[alt='site logo']").first(),
    txt_userName: page.locator("#username"),
    txt_password: page.locator("#password"),
    btn_login: page.getByTestId("login-button"),
    title: page.locator("//h1[contains(text(),'Recent')]"),
    btn_logout: page.getByTestId("logout-btn-desktop"),
    btn_uploadStatement: page.locator("//p[@class='text-tertiary text-sm hidden font-bold leading-4 lg:block' or contains(text(),'Upload')]"),
    uploadFile: page.locator("//input[@id='dropzone-file']"),
    num_claimNumber: page.locator("//input[@name='claimNumber']"),
    verify_claimNumber: (claimNumber: string) =>
      page.locator(`//p[text()='${claimNumber}']`),
    verify_interviewee: (claimNumber: string) =>
      page.locator(`//p[text()='${claimNumber}']//following::p[1]`),
    verify_others: (claimNumber: string) =>
      page.locator(`//p[text()='${claimNumber}']//following::p[2]`),
    closePopUp: page.getByText('Close'),
    btn_viewDetails: (claimNumber: string) =>
      page.locator(`//p[text()='${claimNumber}']//following::a[1][@data-testid='view-details']`),
  };
}
