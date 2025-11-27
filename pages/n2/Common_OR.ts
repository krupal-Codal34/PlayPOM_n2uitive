import type { Locator, Page } from "@playwright/test";

export interface Common_OR {
  signInLink: Locator;
}

export function getCommonLocators(page: Page): Common_OR {
  return {
    signInLink: page.getByRole("button", { name: "Sign In", exact: true }),
  };
}
