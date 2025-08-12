const { expect } = require("@playwright/test");

exports.DispatchPage = class DispatchPage {
  constructor(page, sharedData) {
    this.page = page;
     this.lotInList = sharedData.lotInList;

    // adding locators
    this.dispatch_btn = page.locator('//li/span[text()="Dispatch"]');
    // this.dispatch_btn = page.locator('(//span[text()="Dispatch"])[2]');
    this.lot_record = page.locator(`xpath=//td[@class='option-td']//div[text()='${this.lotInList}']`);
    this.invoice_field = page.locator('//input[@type="text"][1]');
    this.lot_field = page.locator('//div[text()="Lot"]/following-sibling::div[@class="col-6 d-flex flex-wrap t-wrap"]');
    this.draft_record = page.locator('(//td/div[@class="pills col-waiting d-flex ps-2 justify-content-center status-pills"]/p[text()="Draft"])[1]');
    this.group_by = page.locator('//button[@id="dropdownMenuButton1"][text()="Group By"]');
    this.contact_group = page.locator('//li/div[text()="Contact"]');
    this.select_items = page.locator('//button[@id="dropdownMenuButton1"][text()="Select Items"]')
    this.std_group = page.locator('//span[text()="STANDARD APPAREL"]');
    this.update_details = page.locator('//button[@type="button"][text()="Update Details"]');
  }

  async goToDispatch() {

    // go to the Dispatch page
    await this.dispatch_btn.click();
    await this.page.waitForTimeout(3000);
    console.log(this.lotInList);

    // apply the contact filter
    await this.group_by.click();
    await this.contact_group.click();
    await this.page.waitForTimeout(5000);
    await this.select_items.click();
    await this.std_group.click();


    await this.page.waitForTimeout(3000);
    // await this.draft_record.click();
    expect(this.lot_field).toBe(this.lot_record);
    await this.lot_record.click();

    // enter Invoice and Update 
    await this.invoice_field.fill("5677");
    await this.update_details.click();
  }
};
