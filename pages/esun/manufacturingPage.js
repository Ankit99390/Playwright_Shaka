const { expect } = require("@playwright/test");

exports.ManufacturingPage = class ManufacturingPage {
  constructor(page) {
    this.page = page;

    // adding locators
    this.manufacturing_btn = page.locator('//div/span[text()="Manufacturing"]');
    this.ready_status_btn = page.locator('//button[@id="dropdownMenuButton1"][text()="Ready Status"]');
    this.fully_ready = page.locator('//div[@class="dropdown-item d-flex align-items-center justify-content-start"][text()="Fully Ready"]');
    this.first_record = page.locator('(//div[contains(@class, "main-container-matrix")])[1]');
    this.first_record_lot = this.first_record.locator('.lot-num');
    this.detail_page_lot = page.locator('//div[contains(@class, "info-txt-box") and .//span[text()="Lot No"]]/span[2]');
    this.create_batch_btn = page.locator('//button[text()="Create Cutting Report"]');
    this.cut_qty_field = page.locator('//input[contains(@placeholder, "Remaining Quantity")]');
    this.create_btn = page.getByRole('button', { name: 'Create Cutting Report' });
    this.total_cut_unit = page.locator('//div[contains(@class, "info-txt-box")]//span[text()="Total Cut Unit"]/following-sibling::span[1]');
    this.action_btn = page.locator('td > svg[width="17"][height="17"]');
    this.sew_qty_field = page.locator('//div[text()="Sew Quantity"]/following-sibling::input[@type="number"][1]');
    this.save_btn = page.locator('//button[text()="Save"]');
    this.ready_for_dyeing = page.locator('//button[text()="Ready for Dyeing"]');
    this.manufacturing_list_page = page.locator('//span[@class="text-primary"][text()="Manufacturing"]');
    this.ready_unit = this.page.locator('//div[contains(@class, "info-txt-box")]//span[text()="Ready Unit"]/following-sibling::span[1]');
    this.complete_status = this.page.locator('//td/div[text()="completed"]');
  }

  // manufacturing actions
  async goToMaufacturing(sharedData) {

    // apply fully ready filter
    await this.manufacturing_btn.click();
    await this.ready_status_btn.click();
    await this.fully_ready.click();

    // open record and verify the lot number
    await this.page.waitForTimeout(2000);
    const lotInList = await this.first_record_lot.innerText();
    sharedData.lotInList = lotInList;
    await this.first_record.click();
    await this.page.waitForTimeout(3000);
    const lotInDetailPage = await this.detail_page_lot.innerText();
    expect(lotInDetailPage).toBe(lotInList);

    // create batch and enter quanity from placeholder
    await this.page.waitForTimeout(3000);
    await this.create_batch_btn.click();
    const cutQuantity = await this.cut_qty_field.getAttribute("placeholder");  
    const quanity = cutQuantity.match(/\d+/)[0];  //regular expression (/\d+/) to grab only the number
    await this.cut_qty_field.fill(quanity);
    await this.create_btn.click();
    
    // verify cut qty is entered correctly
    await this.page.waitForTimeout(5000);
    const totalCut = await this.total_cut_unit.innerText();
    expect(totalCut).toBe(quanity);

    // click action and enter rest quantities
    await this.action_btn.click();
    await this.sew_qty_field.fill(totalCut);
    await this.page.waitForTimeout(3000);
    await this.save_btn.click();
    await this.page.waitForTimeout(3000);
    await this.action_btn.click();
    await this.page.waitForTimeout(3000);

    // click the ready for dyeing button to compelte the batch
    await this.ready_for_dyeing.click();
    // await this.page.waitForTimeout(10000);
    await this.complete_status.waitFor({ state: 'visible' });

    // check if ready unit is equal to the cut unit
    const readyUnit = await this.ready_unit.innerText();
    expect (readyUnit).toBe(quanity);

    // go back to the list page
    await this.manufacturing_list_page.click();
  }
};

