import type { Locator, Page } from "@playwright/test";
import expect from "@playwright/test";
import CommonActions from "../../CommonActions.js";
import {
  getUploadStatementLocators,
  type UploadStatement_OR,
} from "./UploadStatement_OR.js";
import type MenuOption from "../constants/MenuOption.js";
import { ValueAssertionType, AssertionType } from "playpom";
import { Strings } from "./constants/Strings.js";
import { faker } from "@faker-js/faker";

export default class UploadStatement extends CommonActions {
  protected initialPage: Page;
  protected locators: UploadStatement_OR;

  constructor(page: Page) {
    super(page);
    this.initialPage = page;
    this.locators = getUploadStatementLocators(page);
  }

  async uploadFile(filePath: string): Promise<void> {
    this.logger.log("info", "Uploading file from path: " + filePath);
    this.logger.debug(`Attempting to upload file from path: ${filePath}`);
    const uploadFile: Locator = this.locators.uploadFile;
    await this.UI.fileUpload(uploadFile, filePath);
  }

  async validateValidFile(): Promise<void> {
    this.logger.log("info", "Verifying validation for a valid file.");
    this.logger.debug("Locating the valid file validation message element.");
    // Verify Validation for valid file
    const validFile: Locator = this.locators.validFile;
    const valid_AMessage = Strings.FILEUPLOADED;
    const valid_EMessage: string | null = await validFile.textContent();
    this.logger.verbose(`Actual validation message found: ${valid_EMessage}`);
    this.logger.log("info", `Valid file validation message: Expected '${valid_AMessage}', Actual '${valid_EMessage}'`);
    await this.ASSERT.hardAssertValue(
      valid_AMessage,
      ValueAssertionType.TO_BE,
      valid_EMessage,
      "Verification of Valid file extension",
    );
  }

  async validateInvalidfile(filePath: string): Promise<void> {
    this.logger.log("info", "Verifying validation for an invalid file.");
    this.logger.debug(`Uploading invalid file: ${filePath}`);
    this.uploadFile(filePath);

    const error_Message: Locator = this.locators.error_Message;
    this.logger.log("info", "Waiting for error message to be visible.");
    this.logger.debug("Locating the error message element.");
    await error_Message.waitFor({ state: "visible" });

    // Verify Validation Messages
    const valid_AMessage = Strings.FILETYPEVALIDATION;
    const valid_EMessage: string | null = await error_Message.textContent();
    this.logger.verbose(`Actual error message found: ${valid_EMessage}`);
    this.logger.log("info", `Invalid file validation message: Expected '${valid_AMessage}', Actual '${valid_EMessage}'`);
    await this.ASSERT.hardAssertValue(
      valid_AMessage,
      ValueAssertionType.TO_BE,
      valid_EMessage,
      "Verification of Validation Message of Invalid file",
    );
  }

  async fillForm(page): Promise<void> {
    this.logger.log("info", "Filling the upload statement form.");
    this.logger.debug("Generating a random claim number.");
    const claimNumber = Math.floor(Math.random() * 100000000);

    // Fill out claim Number
    const num_claimNumber: Locator = this.locators.num_claimNumber;
    await this.UI.waitForElementToBe(num_claimNumber, "visible");
    this.logger.debug("Locating claim number input field.");
    this.logger.log("info", `Filling Claim Number: ${claimNumber}`);
    await num_claimNumber.fill(String(claimNumber).trim());

    // Fill Date of Loss
    const datePicker: Locator = page.getByTestId("popover-button");
    this.logger.debug("Clicking on the date picker to select date of loss.");
    await datePicker.click();
    this.logger.log("info", "Selecting today's date for Date of Loss.");
    const dayToday: Locator = page.locator(
      "//button[@name='day' and @aria-selected='true']",
    );
    await dayToday.click();

    // Fill Interviewee First Name and Last Name
    this.logger.debug("Locating and filling interviewee first and last names.");
    const inter_FirstName: Locator = this.locators.inter_FirstName;
    const firstName = faker.person.firstName();
    this.logger.log("info", `Filling Interviewee First Name: ${firstName}`);
    await inter_FirstName.fill(firstName);

    const inter_LastName: Locator = this.locators.inter_LastName;
    const lastName = faker.person.lastName();
    this.logger.log("info", `Filling Interviewee Last Name: ${lastName}`);
    await inter_LastName.fill(lastName);

    // Select Type
    const drp_Type: Locator = this.locators.drp_Type;
    await drp_Type.waitFor({ state: "visible" });
    this.logger.debug("Locating and selecting a type from the dropdown.");
    await drp_Type.click();
    const drp_Value1: Locator = this.locators.drp_Value1;
    await drp_Value1.waitFor({ state: "visible" });
    this.logger.log("info", "Selecting a type from the dropdown.");
    await drp_Value1.click();

    // Fill Insured First Name and Last Name
    this.logger.debug("Locating and filling insured first and last names.");
    const txt_FirstName: Locator = this.locators.txt_FirstName;
    const INSfirstName = faker.person.firstName();
    this.logger.log("info", `Filling Insured First Name: ${INSfirstName}`);
    await txt_FirstName.fill(INSfirstName);

    const txt_LastName: Locator = this.locators.txt_LastName;
    const INSlastName = faker.person.lastName();
    this.logger.log("info", `Filling Insured Last Name: ${INSlastName}`);
    await txt_LastName.fill(INSlastName);

    // Call method to store data in the Json.\
    this.logger.log("info", "Gathering and saving form details.");
    this.logger.debug("Calling getFormDetials to save form data.");
    await this.getFormDetials(
      num_claimNumber,
      page.getByTestId("popover-button"),
      inter_FirstName,
      inter_LastName,
      drp_Type,
      txt_FirstName,
      txt_LastName,
    );

    //Click on Upload
    const btn_Upload: Locator = this.locators.btn_Upload;
    await btn_Upload.waitFor({ state: "visible" });
    this.logger.debug("Locating and clicking the upload button.");
    this.logger.log("info", "Clicking the Upload button.");
    await btn_Upload.click();

    const verifyForm: Locator = this.locators.verifyForm;
    this.logger.log("info", "Verifying form submission status.");
    this.logger.debug("Verifying successful form submission.");
    await this.ASSERT.hardAssert(
      verifyForm,
      AssertionType.TO_HAVE_TEXT,
      "Upload Completed!",
      "Verification of form filled.",
    );
  }

  async getFormDetials(
    claimNumber: Locator,
    DOL: Locator,
    inter_FirstName: Locator,
    inter_LastName: Locator,
    drp_Type: Locator,
    INSfirstName: Locator,
    INSlastName: Locator,
  ) {
    this.logger.log("info", "Extracting form details to save.");
    this.logger.debug("Waiting for claim number element to be visible before extracting data.");
    await claimNumber.waitFor({ state: "visible" });

    // For normal text (labels, spans, divs)
    this.logger.debug("Extracting values from form fields.");
    const ClaimNumber = await claimNumber.inputValue();
    const DateOfLoss = await DOL.innerText();
    const DRP_Type = await drp_Type.innerText();

    // For form input fields
    const INTER_FirstName = await inter_FirstName.inputValue();
    const INTER_LastName = await inter_LastName.inputValue();
    const insfirstName = await INSfirstName.inputValue();
    const inslastName = await INSlastName.inputValue();
    this.logger.verbose(`Extracted form data: Claim Number - ${ClaimNumber}, Date of Loss - ${DateOfLoss}, Type - ${DRP_Type}, Interviewee - ${INTER_FirstName} ${INTER_LastName}, Insured - ${insfirstName} ${inslastName}`);
    this.logger.log("info", `Claim Number: ${ClaimNumber}, Date of Loss: ${DateOfLoss}, Type: ${DRP_Type}`);


    const data = {
      ClaimNumber: ClaimNumber.trim(),
      DOL: DateOfLoss.trim(),
      inter_FirstName: INTER_FirstName.trim(),
      inter_LastName: INTER_LastName.trim(),
      drp_Type: DRP_Type.trim(),
      INSfirstName: insfirstName.trim(),
      INSlastName: inslastName.trim(),
      Adjuster: "Arpit Desai",
      Office: "Shared Services (Codal)",
    };
    this.logger.debug("Creating data object to be saved.");

    const file = "Data/Login/Upload/UploadStatusManagement.json";
    const jsonData = JSON.stringify(data);
    this.logger.debug(`Converting data to JSON and writing to file: ${file}`);
    this.logger.log("info", `Saving form data to ${file}`);
    await this.FILE.saveData(file, jsonData);
  }
}
