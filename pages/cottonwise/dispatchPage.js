const { expect } = require("@playwright/test");
const sharedVariables = require('../sharedVariables');

exports.DispatchPage = class DispatchPage {
  constructor(page) {
    this.page = page;

    // dispatch menu button
    this.dispatch_menu = page.locator('//div/span[text()="Dispatch"]');

    // searchbox
    this.search_box = page.locator('//input[@placeholder="Search..."]');

    // dispatch status dropdown
    this.dispatch_status_dropdown = page.locator('//div/button[text() = "Dispatch Status"]');
    this.draft_filter = page.locator('//li/div[text()="Draft"]');

    // lot number in the result table
    this.table_row_lot = page.locator('(//div[@class="td-text"])[3]');

    // dispatch detailed view
    this.detailed_view_lot = page.locator('//div[@class="row mb-3"]//div[normalize-space(text())="Lot"]/following-sibling::div');
    this.invoice_number = page.locator('(//div[@class="col-6"]/input)[1]');
    this.container_number = page.locator('(//div[@class="col-6"]/input)[2]');
    this.dispatch_status = page.locator('//div[text()="Dispatch Status"]/following-sibling::div');
    this.validate_btn = page.locator('//button[text()="Validate"]');
    this.quantity = page.locator('//td[@class="producing-quantity-td text-center"]');
    this.update_details_btn = page.locator('//button[text()="Update Details"]');

  }


  async clickDispatchMenu() {
    await this.dispatch_menu.click();
  }

  async clickDispatchStatusDropdown() {
    await this.dispatch_status_dropdown.click();
    await this.draft_filter.click();
    console.log("Draft filter clicked");
  }

  async searchByLot() {
    console.log("Searching for lot number:", sharedVariables.displayedFutureLot);
    await this.search_box.fill(sharedVariables.displayedFutureLot);
    await this.search_box.press("Enter");
    await this.table_row_lot.waitFor({state: "visible", timeout: 30000});
  }

  async openRecord() {
    
    const lotNumber = await this.table_row_lot.textContent();
    console.log("Lot number in the result table:", lotNumber);
    await expect(lotNumber).toBe(sharedVariables.displayedFutureLot);
    await this.table_row_lot.click();
    await this.page.pause();
  }

  async detailedViewAssertions() {

    // check lot number
    await this.detailed_view_lot.waitFor({state: "visible", timeout: 5000});
    const detailedLotNumber = await this.detailed_view_lot.textContent();
    console.log("Lot number in the detailed view:", detailedLotNumber);
    await expect(detailedLotNumber).toBe(sharedVariables.displayedFutureLot);

    // check dispatch status
    const dispatchStatus = await this.dispatch_status.textContent();
    console.log("Dispatch status in the detailed view:", dispatchStatus);
    await expect(dispatchStatus).toBe("Draft");

    // check update details button
    await expect(this.update_details_btn).toBeDisabled();

    // check validate button
    await expect(this.validate_btn).toBeDisabled();

    //check quantity
    // for (let i = 0; i < sharedVariables.expectedProducedQuantities.length; i++) {
    //   const quantity = await this.quantity.textContent();
    //   console.log("Quantity in the detailed view:", quantity);
    //   await expect(quantity).toBe(sharedVariables.expectedProducedQuantities[i]);
    // }
  }

  async dispatchActions() {
    await this.invoice_number.fill("1234");
    await this.container_number.fill("321");

    // check update details button
    await expect(this.update_details_btn).toBeEnabled();

    // click update details button
    await this.update_details_btn.click();

    // check validate button
    await expect(this.validate_btn).toBeEnabled();

    // click validate button
    await this.validate_btn.click();
  }

  async dispatchedAssertions() {

    // check dispatch status
    const dispatchStatus = await this.dispatch_status.textContent();
    console.log("Dispatch status in the detailed view:", dispatchStatus);
    await expect(dispatchStatus).toBe("Dispatched");

    // check invoice number
    const invoiceNumber = await this.invoice_number.textContent();
    console.log("Invoice number in the detailed view:", invoiceNumber);
    await expect(invoiceNumber).toBe("1234");

    // check container number
    const containerNumber = await this.container_number.textContent();
    console.log("Container number in the detailed view:", containerNumber);
    await expect(containerNumber).toBe("321");

    //check validate button
    await expect(this.validate_btn).toBeHidden();

  }
  
}