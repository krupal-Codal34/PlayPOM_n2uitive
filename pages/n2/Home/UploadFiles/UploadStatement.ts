import type { Locator, Page } from "@playwright/test";
import expect from "@playwright/test";
import CommonActions from "../../CommonActions.js";
import { getUploadStatementLocators, type UploadStatement_OR } from "./UploadStatement_OR.js";
import type MenuOption from "../constants/MenuOption.js";
import { ValueAssertionType,AssertionType } from "playpom";
import { Strings } from "./constants/Strings.js";
import { faker } from '@faker-js/faker';


export default class UploadStatement extends CommonActions {
  protected initialPage: Page;
  protected locators: UploadStatement_OR;


  constructor(page: Page) {
    super(page);
    this.initialPage = page;
    this.locators = getUploadStatementLocators(page);
  }

  async uploadFile(filePath: string): Promise<void> {

    const uploadFile: Locator = this.locators.uploadFile;
    await this.UI.fileUpload(uploadFile, filePath)
  }

  async validateValidFile(): Promise<void> {
    // Verify Validation for valid file
    const validFile: Locator = this.locators.validFile;
    const valid_AMessage = Strings.FILEUPLOADED
    const valid_EMessage: string | null = await validFile.textContent();
    await this.ASSERT.hardAssertValue(valid_AMessage, ValueAssertionType.TO_BE, valid_EMessage, "Verification of Valid file extension");

  }
  
  async validateInvalidfile(filePath: string): Promise<void> {

    this.uploadFile(filePath)

    const error_Message: Locator = this.locators.error_Message;
    await error_Message.waitFor({ state: 'visible' });

    // Verify Validation Messages
    const valid_AMessage = Strings.FILETYPEVALIDATION
    const valid_EMessage: string | null = await error_Message.textContent();
    await this.ASSERT.hardAssertValue(valid_AMessage, ValueAssertionType.TO_BE, valid_EMessage, "Verification of Validation Message of Invalid file");
  }

  async fillForm(page): Promise<void> {

    const claimNumber = Math.floor(Math.random() * 100000000);

    // Fill out claim Number
    const num_claimNumber: Locator = this.locators.num_claimNumber;
    await this.UI.waitForElementToBe(num_claimNumber, 'visible')
    await num_claimNumber.fill(String(claimNumber).trim())

    // Fill Date of Loss
    const datePicker:Locator = page.getByTestId('popover-button')
    await datePicker.click();
    const dayToday: Locator = page.locator("//button[@name='day' and @aria-selected='true']");
    await dayToday.click();

    // Fill Interviewee First Name and Last Name
    const inter_FirstName: Locator = this.locators.inter_FirstName;
    const firstName = faker.person.firstName()
    await inter_FirstName.fill(firstName)

    const inter_LastName: Locator = this.locators.inter_LastName;
    const lastName = faker.person.lastName()
    await inter_LastName.fill(lastName)

    // Select Type
    const drp_Type: Locator = this.locators.drp_Type;
    await drp_Type.waitFor({ state: 'visible' });
    await drp_Type.click();
    const drp_Value1: Locator = this.locators.drp_Value1;
    await drp_Value1.waitFor({ state: 'visible' });
    await drp_Value1.click();


    // Fill Insured First Name and Last Name
    const txt_FirstName: Locator = this.locators.txt_FirstName;
    const INSfirstName = faker.person.firstName()
    await txt_FirstName.fill(INSfirstName)

    const txt_LastName: Locator = this.locators.txt_LastName;
    const INSlastName = faker.person.lastName()
    await txt_LastName.fill(INSlastName)

    // Call method to store data in the Json.\
    await this.getFormDetials(num_claimNumber,page.getByTestId('popover-button'),inter_FirstName,inter_LastName,drp_Type,txt_FirstName,txt_LastName)

    //Click on Upload
    const btn_Upload: Locator = this.locators.btn_Upload;
    await btn_Upload.waitFor({ state: 'visible' });
    await btn_Upload.click();

    const verifyForm: Locator = this.locators.verifyForm;
    await this.ASSERT.hardAssert(verifyForm, AssertionType.TO_HAVE_TEXT, "Upload Completed!", "Verification of form filled.");    
  }

  
  async getFormDetials(
  claimNumber: Locator,
  DOL: Locator,
  inter_FirstName: Locator,
  inter_LastName: Locator,
  drp_Type: Locator,
  INSfirstName: Locator,
  INSlastName: Locator
) {

  await claimNumber.waitFor({ state: 'visible' });

  // For normal text (labels, spans, divs)
  const ClaimNumber = await claimNumber.inputValue();
  const DateOfLoss = await DOL.innerText();
  const DRP_Type = await drp_Type.innerText();

  // For form input fields
  const INTER_FirstName = await inter_FirstName.inputValue();
  const INTER_LastName = await inter_LastName.inputValue();
  const insfirstName = await INSfirstName.inputValue();
  const inslastName = await INSlastName.inputValue();

  const data = {
    ClaimNumber: ClaimNumber.trim(),
    DOL: DateOfLoss.trim(),
    inter_FirstName: INTER_FirstName.trim(),
    inter_LastName: INTER_LastName.trim(),
    drp_Type: DRP_Type.trim(),
    INSfirstName: insfirstName.trim(),
    INSlastName: inslastName.trim(),
    Adjuster: "Arpit Desai",
    Office: "Shared Services (Codal)"
  };

 const file = 'Data/Login/Upload' 
 await this.writeDataToJson(data, 'formdata.json', file);
 const readBack = await this.readJson('formdata.json',file);
}




}