import type { Locator, Page } from "@playwright/test";

/**
 * Defines the structure of the locator object for the View Page.
 * Each property corresponds to a specific UI element locator on the page.
 */
export interface ViewPage_OR {
  siteLogo: Locator;
  insuredValue: Locator;
  intervieweeValue: Locator;
  intervieweeTypeValue: Locator;
  dateOfIncidentValue: Locator;
  adjusterValue: Locator;
  officeValue: Locator;
  audioDurationText: Locator;

  /**
   * A dynamic locator function to find a claim number element by its text.
   * @param claimNumber The exact claim number text to locate.
   */
  claimNumberByText: (claimNumber: string) => Locator;
}

/**
 * A factory function to create a complete set of locators for the View Page.
 * This pattern encapsulates locator definitions and keeps them separate from test logic.
 * @param page The Playwright `Page` object instance.
 * @returns An object of type `ViewPage_OR` containing all locators for the page.
 */
export function getViewPageLocators(page: Page): ViewPage_OR {
  return {
    siteLogo: page.locator("[alt='site logo']").first(),
    insuredValue: page.locator("(//p[text()='Insured']//following::p[1])[1]"),
    intervieweeValue: page.locator(
      "(//p[text()='Interviewee']//following::p[1])[1]",
    ),
    intervieweeTypeValue: page.locator(
      "(//p[text()='Interviewee Type']//following::p[1])[1]",
    ),
    dateOfIncidentValue: page.locator(
      "(//p[text()='Date of Incident']//following::p[1])[1]",
    ),
    adjusterValue: page.locator("(//p[text()='Adjuster']//following::p[1])[1]"),
    officeValue: page.locator("(//p[text()='Office']//following::p[1])[1]"),

    claimNumberByText: (claimNumber: string) =>
      page.locator(`//p[text()='${claimNumber}']`),

    audioDurationText: page.locator("//audio[@id='audio-tag']/following::p[2]"),
  };
}
