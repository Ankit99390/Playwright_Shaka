const { expect } = require("@playwright/test");

export class HideStatus {
  constructor(page) {
    this.page = page;
    this.dispatch_page = page.locator("//div/span[text()='Dispatch']");
    this.filter_btn = page.locator("//button[@id='dropdownMenuButton1'][text()='Status']");
  }

  async goToDispatchPage() {
    await this.dispatch_page.click();
    await this.page.waitForLoadState("networkidle");
  }

  async applyFilter(filterName, expectedCount) {
    const apply_filter = this.page.locator(`//div[normalize-space(text())='${filterName}']`);
    const applied_filter_record = this.page.locator(`//div[contains(@class, "status-pills")]//p[normalize-space(text())='${filterName}']`);

    await this.filter_btn.click();
    await apply_filter.click();
    await this.page.waitForTimeout(4000);
    const count = await applied_filter_record.count();

    expect(count).toBe(expectedCount);
  }
}
