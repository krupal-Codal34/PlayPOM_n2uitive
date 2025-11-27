import type { Locator, Page } from "@playwright/test";

export interface LoginPage_OR {
  homeLogo: Locator;
  txt_userName: Locator;
  txt_password: Locator;
  btn_login: Locator;
  errorLocator: Locator;
  emptyUserName: Locator;
  emptyPassword: Locator;
}

export function getLoginPageLocators(page: Page): LoginPage_OR {
  return {
    homeLogo: page.locator("[alt='Site logo']"),
    txt_userName: page.locator("[name='username']"),
    txt_password: page.locator("[name='password']"),
    btn_login: page.getByTestId("login-button"),
    errorLocator: page.locator("//p[@class='text-xs leading-4 font-normal visible mt-1.5 flex h-5 items-center text-error transition-all']//span"),
    emptyUserName: page.getByText("Email is required"),
    emptyPassword: page.getByText("Password is required")
  };
}
