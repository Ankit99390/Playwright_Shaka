const { expect } = require("@playwright/test");

export class RecordSort {
  constructor(page) {
    this.page = page;
    this.manufacturing_btn = page.locator('//div/span[text()="Manufacturing"]');
    this.toggle_list_btn = page.locator("//button[text() = 'Toggle View']");
    this.sku_sort_btn = page.getByRole("cell", { name: "SKU Code" }).getByRole("img");
    this.sku_records = page.locator("//table//tr/td[1]/div");
  }

  async goToListView() {
    await this.manufacturing_btn.click();
    await this.toggle_list_btn.click();
  }

  async sortSku() {
    await this.page.waitForTimeout(5000);
    await this.sku_sort_btn.click();
    await this.sku_sort_btn.click();
    await this.page.waitForTimeout(3000);

    const skuElements = await this.sku_records.allTextContents();

    const sortedSkus = [...skuElements].sort((a, b) => a.localeCompare(b));

    expect(skuElements).toEqual(sortedSkus);
  }
}
