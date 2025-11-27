import type { Locator, Page } from "@playwright/test";

export interface HomePage_OR {
  homeLogo: Locator;
  txt_userName: Locator;
  txt_password: Locator;
  btn_login: Locator;
  title: Locator;
  btn_logout: Locator;
  btn_uploadStatement: Locator,
  uploadFile: Locator,
  num_claimNumber: Locator,

}

export function getHomePageLocators(page: Page): HomePage_OR {
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
  };
}
