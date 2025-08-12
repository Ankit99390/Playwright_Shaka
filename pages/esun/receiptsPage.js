const { expect } = require("@playwright/test");
exports.ReceiptPage = class ReceiptPage {
  constructor(page) {
    this.page = page;

    // receipts menu button
    this.receipts_menu = page.locator('//div/span[text()="Receipts"]');

    // receipt status dropdown
    this.receipt_status_dropdown = page.locator('//div/button[text() = "Status"]');
    this.assigned_filter = page.locator('//li/div[text()="Assigned"]');

    // list page records
    this.first_lot_record = page.locator('(//td[@class="checkbox-td text-center"]/div)[1]')
    this.first_po_record = page.locator('(//td[@class="option-td"]/div)[2]')
    this.first_inovice_no = page.locator('(//td[@class="checkbox-td text-center"]/div)[3]');

    // detailed view fields
    this.detailed_view_invoice_no = page.locator('//div[@class="row mb-3"]//div[normalize-space(text())="Invoice No"]/following-sibling::div');
    this.detailed_view_po_number = page.locator('//div[@class="row mb-3"]//div[normalize-space(text())="Source"]/following-sibling::div');

    // validate button
    this.validate_btn = page.locator('//button[text()="Validate"]');
  }


  async clickReceiptsMenu() {
    await this.receipts_menu.click();
  }

  async applyStatusFilter() {
    await this.receipt_status_dropdown.click();
    await this.assigned_filter.click();
  }

  async openFirstRecord() {

    // get po number
    const po_number = await this.first_po_record.textContent()
    this.po_number = po_number;

    // get invoice number
    const invoice_no = await this.first_invoice_no.textContent()
    this.invoice_no = invoice_no;

    await this.first_po_record.click();
  }

  async detailedViewAssertions() {

    // get detailed view data
    const detailed_view_invoice_no = await this.detailed_view_invoice_no.textContent();
    const detailed_view_po_number = await this.detailed_view_po_number.textContent();

    await expect(detailed_view_invoice_no).toBe(this.invoice_no);
    await expect(detailed_view_po_number).toBe(this.po_number);
  }

  async clickValidateBtn() {
    await this.validate_btn.click();
  }
}

