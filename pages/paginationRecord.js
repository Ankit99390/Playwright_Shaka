const { expect } = require("@playwright/test");

export class PaginationRecord {
  constructor(page) {
    this.page = page;
    this.manufacturing_btn = page.locator('//div/span[text()="Manufacturing"]');
    this.recordRows = page.locator("//tr[@class='table-row']");
    this.recordRangeText = page.locator("span.record-range");
  }

  async goToManufacturingPage() {
    await this.manufacturing_btn.click();
  }
  async recordCountMatch(paginationCount) {
    await this.page.waitForTimeout(5000);
    const totalRecordsCounted = await this.recordRows.count();

    // const rangeText = await this.recordRangeText.innerText();
    // const [start, end] = rangeText.split(" - ").map(Number);
    // const paginationCount = end - start + 1;

    
    console.log("total records on the list:",totalRecordsCounted);
    console.log("records displayed on pagination:",paginationCount);

    expect(paginationCount).toBe(totalRecordsCounted);
  }
}
