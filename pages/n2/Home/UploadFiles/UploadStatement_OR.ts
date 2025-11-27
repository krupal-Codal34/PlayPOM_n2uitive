import type { Locator, Page } from "@playwright/test";

export interface UploadStatement_OR {
  num_claimNumber:Locator;
  uploadFile: Locator;
  error_Message:Locator,
  validFile:Locator;
  datePicker:Locator;
  dayToday:Locator;
  inter_FirstName:Locator;
  inter_LastName:Locator;
  drp_Type:Locator;
  drp_Value1:Locator;
  txt_FirstName:Locator;
  txt_LastName:Locator;
  btn_Upload:Locator;
  verifyForm:Locator;

}

export function getUploadStatementLocators(page: Page): UploadStatement_OR {
  return {
    uploadFile: page.locator("//input[@id='dropzone-file']"),
    num_claimNumber: page.locator("//input[@name='claimNumber']"),
    error_Message: page.locator("//span[contains(text(),'This file type is not accepted')]"),
    validFile: page.getByText('File Uploaded successfully'),
    datePicker: page.locator('[data-testid="popover-button"]'),
    dayToday: page.locator("//button[@name='day' and @aria-selected='true']"),
    inter_FirstName: page.locator("//input[@name='intervieweeFirstName']"),
    inter_LastName: page.locator("//input[@name='intervieweeLastName']"),
    drp_Type: page.getByRole("combobox"),
    drp_Value1: page.getByText("Witness"),
    txt_FirstName: page.locator("//input[@name='insuredFirstName']"),
    txt_LastName: page.locator("//input[@name='insuredLastName']"),
    btn_Upload: page.getByRole('button', {'name':"Upload"}),
    verifyForm: page.getByText("Upload Completed!")

  };
}
