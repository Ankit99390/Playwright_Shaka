const { expect } = require("@playwright/test");
const sharedVariables = require('../sharedVariables');

exports.ManufacturingPage = class ManufacturingPage {
  constructor(page) {
    this.page = page;

    // manufacturing menu button
    this.manufacturing_menu = page.locator('//div/span[text()="Manufacturing"]');

    // status filter
    this.status_dropdown = page.locator('//div/button[text() = "Status"]');
    this.assigned_filter = page.locator('//li/div[text()="Assigned"]');

    // bulk manufacturing
    this.bulk_manufacturing_btn = page.locator('//button[text() = "Bulk Manufacturing"]');
    this.record_boolean = page.locator('(//input[@type="checkbox"])[1]');

    // table container
    this.table_container = page.locator('//div[@class="table-container table-1 position-relative mb-3 d-none table-right-split"]');
    this.lot_field_cell = page.locator('(//td[@class="lotno-td text-center"])[1]');
    this.produced_qty_field = page.locator('(//td[@class="producing-quantity-td text-center"]/input)[1]');
    this.demand_qty_cells = page.locator('table.w-100 > tbody > tr > td.demand-quantity-td.text-center');
    this.produced_qty_inputs = page.locator('td.producing-quantity-td.text-center input[type="number"]');
    this.save_as_draft_btn = page.locator('//button[text()="Save As Draft"]');
    this.saved_toast = page.getByText("Quantity has been updated.");

    // validate button
    this.validate_btn = page.locator('//button[text()="Validate"]');
    this.validated_toast = page.getByText("Production Marked for 1 lot(s)");
    this.validating_loader = page.getByText("Validating...");

    // clear filter
    this.clear_filter_btn = page.locator('//button[text()="Clear Filters"]');

    // searchbox
    this.search_box = page.locator('//input[@placeholder="Search..."]');
    this.search_result_table = page.locator('//table[@class="w-100"]');
    this.table_row_lot = page.locator('(//div[@class="td-text"])[3]');

    // detailed view
    this.detail_view_lot = page.locator('//div[@class="row mb-3"]//div[normalize-space(text())="Lot"]/following-sibling::div');
    this.detail_view_status = page.locator('//div[@class="row mb-3"]//div[normalize-space(text())="Status"]/following-sibling::div');
    this.detail_view_produced_qty_cells = page.locator('td.producing-quantity-td.text-center div.td-num');

    this.getProducedQtyInputInRow = (rowIndex) => page.locator(`table.w-100 > tbody > tr:nth-child(${rowIndex + 1}) td.producing-quantity-td.text-center input[type="number"]`).first();

    // Locator for clear button in a specific row
    this.getClearButtonInRow = (rowIndex) => page.locator(`table.w-100 > tbody > tr:nth-child(${rowIndex + 1}) td.actions-td .td-num`);
  }

  async clickManufacturingMenu() {
    await this.manufacturing_menu.click();
  }

  async clickStatusDropdown() {
    await this.status_dropdown.click();
    await this.assigned_filter.click();
    await this.bulk_manufacturing_btn.waitFor({state: "visible", timeout: 3000});
  }

  async clickBulkManufacturingBtn() {
    await this.bulk_manufacturing_btn.click();
    await this.record_boolean.waitFor({ state: "visible", timeout: 3000 });
  }

  async clickRecordBoolean() {
    await this.record_boolean.click();
    await this.table_container.waitFor({ state: "visible", timeout: 3000 });
    await expect(this.table_container).toBeVisible();
  }

  async getLotNumber() {
    const lotNumber = await this.lot_field_cell.textContent();
    console.log("Lot number:", lotNumber);

    // store lot number in shared variables
    sharedVariables.displayedFutureLot = lotNumber;
    this._lotNumber = lotNumber;
  }

  async fillProducedQtyWithDemandQty() {
    const rowCount = await this.demand_qty_cells.count();
    const producedQuantities = [];
    for (let i = 0; i < rowCount; i++) {
      const demandCell = this.demand_qty_cells.nth(i);
      const producedInput = this.getProducedQtyInputInRow(i);
      const clearButton = this.getClearButtonInRow(i);
      const demandQtyText = await demandCell.textContent();
      const demandQty = parseFloat(demandQtyText);

      // Check if produced qty input is already filled (not empty or not zero)
      const currentValue = await producedInput.inputValue();
      if (currentValue && parseFloat(currentValue) !== 0) {
        await clearButton.click();
        await producedInput.waitFor({ state: "visible", timeout: 3000 });
      }
      if (!isNaN(demandQty)) {
        await producedInput.waitFor({ state: "visible", timeout: 3000 });
        await expect(producedInput).toBeEnabled();
        console.log(
          `Filling produced qty input at row ${i} with value ${demandQty}`
        );
        await producedInput.fill(demandQty.toString());
        producedQuantities.push(demandQty);
      }
    }
    return producedQuantities;
  }

  async clickSaveAsDraftBtn() {
    await this.save_as_draft_btn.click();
    await expect(this.saved_toast).toBeVisible();
  }

  async clickValidateBtn() {
    await this.validate_btn.click();
    await expect(this.table_container).toBeHidden();
    await this.page.waitForTimeout(10000);
    await this.page.reload();
  }

  async clearFilter() {
    await this.clear_filter_btn.click();
  }

  async seachByLot() {
    await this.search_box.fill(this._lotNumber);
    await this.search_box.press("Enter");
    await this.search_result_table.waitFor({state: "visible", timeout: 30000});
    await expect(this.search_result_table).toBeVisible();
    const tableRowLot = await this.table_row_lot.textContent();
    await expect(tableRowLot).toBe(this._lotNumber);
    console.log("Lot number in list page:", tableRowLot);

    this._tableRowLot = tableRowLot;
  }

  async detailedViewAssertions(expectedProducedQuantities) {
    await this.table_row_lot.click();

    // check lot number
    const detailLotNumber = await this.detail_view_lot.textContent();
    await expect(detailLotNumber).toBe(this._tableRowLot);
    console.log("Lot number in detail view:", detailLotNumber);

    // check status
    const status = await this.detail_view_status.textContent();
    await expect(status).toBe("Done");
    console.log("Status in detail view:", status);

    // check produced quantities
    await this.detail_view_produced_qty_cells.first().waitFor({ state: "visible", timeout: 5000 });
    for (let i = 0; i < expectedProducedQuantities.length; i++) {
      const cell = this.detail_view_produced_qty_cells.nth(i * 2);
      const cellText = await cell.textContent();
      const cellValue = parseFloat(cellText);
      console.log(`Produced qty in detail view at row ${i}:`, cellValue);
      expect(cellValue).toBeCloseTo(expectedProducedQuantities[i], 1); // 1 decimal place

      // store produced quantities in shared variables
      sharedVariables.expectedProducedQuantities.push(cellValue);
    }
  }
};
