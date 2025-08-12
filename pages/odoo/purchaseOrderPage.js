const { expect } = require("@playwright/test");

exports.PurchaseOrderPage = class PurchaseOrderPage {
  constructor(page) {
    this.page = page;

    //detailed page locators
    this.purchase_menu = page.locator('//a/div[text()="Purchase"]');
    this.new_order_btn = page.locator('//div[@class="o_control_panel_main_buttons d-flex gap-1 d-empty-none d-print-none"]', {timeout: 3000});
    this.vendor_field = page.locator('//input[@id="partner_id_0"]', {timeout: 3000});
    this.select_vendor = page.locator('//li[@class="o-autocomplete--dropdown-item ui-menu-item d-block"][1]');
    this.add_product_btn = page.locator('//a[text()="Add a product"]');
    this.product_field = page.locator('//div[@name="product_template_id"]/div/div/div/input');
    this.select_product = page.locator('//li[@class="o-autocomplete--dropdown-item ui-menu-item d-block"][1]');
    this.vendor_ref_field = page.locator('//input[@id="partner_ref_0"]');
    this.future_lot_field = page.locator('//input[@id="future_lot_start_seq_0"]');
    this.confirm_order_btn = page.locator('//button/span[text()="Confirm Order"]');
    this.validation_popup = page.locator('//div[contains(@class, "modal-content") and contains(@class, "o_error_dialog")]');
    this.validation_popup_close_btn = page.locator('//footer//button[contains(@class, "btn-primary") and text()="Close"]');

    //variants modal locatorsgetRandomNumberInRangegetRandomNumberInRange)="Choose Product Variants"]');
    this.variants_modal = page.locator('//div[@class="modal-content"]');
    this.select_variant1 = page.locator('(//input[@type="number"])[1]');
    this.select_variant2 = page.locator('(//input[@type="number"])[38]');
    this.confirm_btn = page.locator('//footer/button[@class="btn btn-primary"]');

    //rolls modal locators
    this.rolls_field1 = page.locator('(//td[@name="roll_id"])[1]');
    this.rolls_field2 = page.locator('(//td[@name="roll_id"])[2]');
    this.input_rolls = page.locator('//div[@name="roll_id"]/div/div/div/input')
    this.select_roll = page.locator('//li[@class="o-autocomplete--dropdown-item ui-menu-item d-block"][1]')
    
    // Locators for readonly fields after validation
    this.state_confirmed = page.locator('//button[@aria-checked="true"][text()="Purchase Order"]');
    this.po_name_field = page.locator('//div/input[@id="name_0"]');
    this.vendor_name_display = page.locator('//div[@name="partner_id"]//a[@class="o_form_uri"]/span');
    this.vendor_ref_display = page.locator('//div[@name="partner_ref"]//input[@id="partner_ref_0"]');
    this.future_lot_display = page.locator('//div[@name="future_lot_start_seq"]//span');

    // Locators for product table rows
    this.product_rows = page.locator('//tr[contains(@class, "o_data_row")]');
    this.product_desc_in_row = row => row.locator('xpath=td[@name="name"]//span');
    this.rolls_in_row = row => row.locator('xpath=td[@name="roll_id"]');
    this.future_lot_in_row = row => row.locator('xpath=td[@name="future_lot"]');

    //list page locators
    this.list_page_btn = page.locator('//a[text()="Requests for Quotation"]');
    this.search_box = page.locator('//div/input[@role="searchbox"]');
    this.list_data_rows = page.locator('//tr[contains(@class, "o_data_row")][1]');

    //list page records locators 
    this.list_ref_field =page.locator('td[name="name"]');
    this.list_vendor_ref =page.locator('td[name="partner_ref"]');
    this.list_vendor_cell =page.locator('td[name="partner_id"]');
    this.list_status_cell =page.locator('td[name="state"]');

  }

  async gotoPurchaseOrderPage() {
    await this.purchase_menu.click();
    await this.page.waitForTimeout(2000);
  }

  async createNewOrder(){
    await this.new_order_btn.click();
    await this.page.waitForTimeout(2000);
  }

  async addVendor(vendor){
    await this.vendor_field.fill(vendor);
    await this.select_vendor.click();

    // Store vendor for later assertion
    this._entered_vendor = vendor;
  }

  async addVendorRef(vendor_ref){ 

    if (!vendor_ref) {
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      vendor_ref = `${month}_${day}`;
    }
    await this.vendor_ref_field.fill(vendor_ref);

    // Store vendor reference for later assertion
    this._entered_vendor_ref = vendor_ref;
  }


  async addProducts(product){
    await this.add_product_btn.click();
    await this.product_field.fill(product);
    await this.select_product.click();
    await this.variants_modal.waitFor({ state: "visible"});
    await expect(this.variants_modal).toBeVisible();
    await this.select_variant1.fill("1");
    await this.select_variant2.fill("1");
    await this.confirm_btn.click();
    await expect(this.variants_modal).toBeHidden();

    // Store product for later assertion
    this._entered_product = product;
  }

  async addRolls(){
    await this.rolls_field1.click();
    await this.input_rolls.click();
    await this.select_roll.click();
    await this.page.waitForTimeout(2000);
    await this.rolls_field2.click();
    await this.input_rolls.click();
    await this.select_roll.click();
    await this.page.waitForTimeout(2000);

    // Store rolls for later assertion 
    this._entered_rolls = '16';
  }
  
  async addRandomFutureLot(maxRetries = 5) {
    let retries = 0;
    let future_lot;

    while (retries < maxRetries) {
      // Generate a random 5-digit number
      future_lot = Math.floor(10000 + Math.random() * 90000).toString();
      await this.future_lot_field.fill(future_lot);
      this._entered_future_lot = future_lot;
      // Click confirm order
      await this.confirm_order_btn.click();
      // Check for validation popup
      if (await this.validation_popup.isVisible({ timeout: 1000 }).catch(() => false)) {
        await this.validation_popup_close_btn.click();
        retries++;
        continue;
      }

      await this.state_confirmed.waitFor({ state: "visible", timeout: 30000 });
      await expect(this.state_confirmed).toBeVisible();
      break;

  }

    if (retries === maxRetries) {
      throw new Error('Could not generate a unique future lot number after ' + maxRetries + ' attempts.');
    }
  }

    // Validating displayed data in the detailed page
    async detailedPageAssertions(){
    const poName = await this.po_name_field.inputValue();
    console.log('PO Name:', poName);

    // Store PO name for later use
    this._poName = poName;

    const displayedVendor = await this.vendor_name_display.textContent();
    expect(displayedVendor.trim()).toBe(this._entered_vendor.toUpperCase());
    console.log('Displayed Vendor:', displayedVendor);

    const displayedVendorRef = await this.vendor_ref_display.inputValue();
    expect(displayedVendorRef.trim()).toBe(this._entered_vendor_ref);
    console.log('Displayed Vendor Ref:', displayedVendorRef);

    const displayedFutureLot = await this.future_lot_display.textContent();
    expect(displayedFutureLot.replace(/,/g, '').trim()).toBe(this._entered_future_lot.toString());
    console.log('Displayed Future Lot:', displayedFutureLot);


    // Validating products row data in the detailed page
    const rowCount = await this.product_rows.count();
    for (let i = 0; i < rowCount; i++) {
      const row = this.product_rows.nth(i);
      const productDesc = await this.product_desc_in_row(row).textContent();
      expect(productDesc).toContain(this._entered_product);
      console.log(`Row ${i + 1} Product Description:`, productDesc);

      const rolls = await this.rolls_in_row(row).textContent();
      expect(rolls.replace(/,/g, '').trim()).toBe(this._entered_rolls);
      console.log(`Row ${i + 1} Rolls:`, rolls);

      const futureLot = await this.future_lot_in_row(row).textContent();
      const expectedLot = (parseInt(this._entered_future_lot, 10) + i).toString();
      expect(futureLot.replace(/,/g, '').trim()).toBe(expectedLot);
      console.log(`Row ${i + 1} Future Lot:`, futureLot);
    }
  }

  async goToListPage(){
    await this.list_page_btn.click();
    await this.search_box.waitFor({ state: "visible", timeout: 2000 });
  }

  async searchPO(){
    await this.search_box.fill(this._poName);
    await this.search_box.press('Enter');
    await this.page.waitForTimeout(3000);
   
  }

  async listPageAssertions() {

    // Reference Field (should match PO name)
    const refCell = await this.list_ref_field.innerText();
    await expect(refCell).toBe(this._poName);
    console.log('List Reference:', refCell);
    

    // Vendor Field (should match vendor name)
    const vendorCell = await this.list_vendor_cell.innerText();
    await expect(vendorCell).toBe(this._entered_vendor.toUpperCase());
    console.log('Vendor:', vendorCell);

    // Status (should be "Purchase Order")
    const statusCell = await this.list_status_cell.innerText();
    await expect(statusCell).toBe("Purchase Order");
    console.log('Status:', statusCell);
}
};