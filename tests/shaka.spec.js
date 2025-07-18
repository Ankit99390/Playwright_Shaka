import { test, expect } from "@playwright/test";

test.beforeEach("Login", async ({ page }) => {
  await page.goto("https://vendor17staging.shakawear.com/login");

  await page.waitForSelector('//input[@name="login"]', { timeout: 7000 });
  await page.locator('//input[@name="login"]').fill("li@esunhn.com");
  await page.locator('//input[@name="password"]').fill("1234");
  await page.locator('//button[@type="submit"]').click();

  await page.waitForLoadState("networkidle");

  await expect(page.locator("text=Orders")).toHaveCount(2);
});

test("Add packages", async ({ page }) => {
  await page.locator('//div/span[text()="Packages"]').click();

  await page.locator('//button[text()="Add Box"]').click();

  await page.locator('//button[@id="dropdownMenuButton1"]').click();

  await page
    .locator("div.dropdown-item", {
      hasText: "[MHS034X] Max Heavyweight S/S (Navy, 4XL) - ESUN/94940- 2",
    })
    .click();

  await page
    .locator('//input[@class="quantity-input w-20 t-wrap"][@type="number"]')
    .fill("1");

  await page.locator('//button[text()="Add"]').click();

  await page.locator('//button[@id="dropdownMenuButton1"]').click();

  await page
    .locator("div.dropdown-item", {
      hasText: "[RHS02XL] Retro Heavyweight (Black, XL) - ESUN/93973- 1",
    })
    .click();

  await page
    .locator('//input[@class="quantity-input w-20 t-wrap"][@type="number"]')
    .fill("1");

  await page.locator('//button[text()="Add"]').click();

  await page.locator('//button[@type="button"][text()="Submit"]').click();

  await expect(page.locator("text=Package is created")).toBeVisible();

  await page.locator("text=Print Label").click();

  await expect(page.locator("text= Label Printing Initiated")).toBeVisible();

  await page.close();
});

test("add quantity from placeholder", async ({ page }) => {
  // Navigate to Packages section
  await page.locator('//div/span[text()="Packages"]').click();

  // Click on "Add Box"
  await page.locator('//button[text()="Add Box"]').click();

  // Open the product dropdown
  await page.locator('//button[@id="dropdownMenuButton1"]').click();

  // Select the specific product from dropdown
  await page
    .locator("div.dropdown-item", {
      hasText: "[MHS034X] Max Heavyweight S/S (Navy, 4XL) - ESUN/94940- 2",
    })
    .click();

  // Locate the quantity input
  const quantityInput = page.locator("input.quantity-input");

  // Wait for the input to be visible
  await quantityInput.waitFor({ state: "visible", timeout: 5000 });

  // Read the placeholder value
  const placeholder = await quantityInput.getAttribute("placeholder");
  console.log("Placeholder:", placeholder);

  // Extract the quantity number from placeholder text
  const match = placeholder?.match(/Available Qty\s*:\s*(\d+)/);
  if (!match) throw new Error("Could not extract quantity from placeholder");

  const availableQty = match[1];

  // Fill the extracted quantity into the input field
  await quantityInput.fill(availableQty);

  // Verify that the input has the correct value
  await expect(quantityInput).toHaveValue(availableQty);

  // Click the Add button
  await page.locator('//button[text()="Add"]').click();

  await expect(page.locator("text=Submit")).toBeVisible();
});

test.only("add packages with loop", async ({ page }) => {

  await page.locator('//div/span[text()="Packages"]').click();

  await page.locator('//button[text()="Add Box"]').click();

  // Loop to add the first 5 products
  for (let i = 0; i < 5; i++) {
    // Open the dropdown
    await page.locator('//button[@id="dropdownMenuButton1"]').click();

    // Get the list of dropdown items
    const items = page.locator("div.dropdown-item");

    // Wait for at least (i+1) items to appear
    await expect(items.nth(i)).toBeVisible({ timeout: 5000 });

    // Click on the i-th product
    await items.nth(i).click();

    // Locate the quantity input
    const quantityInput = page.locator("input.quantity-input");

    // Wait until it's visible
    await quantityInput.waitFor({ state: "visible", timeout: 5000 });

    // Read the placeholder value
    const placeholder = await quantityInput.getAttribute("placeholder");
    // console.log(`Placeholder for product ${i + 1}:`, placeholder);

    // Extract available quantity
    const match = placeholder?.match(/Available Qty\s*:\s*(\d+)/);
    if (!match)
      throw new Error(
        `Could not extract quantity from placeholder for product ${i + 1}`
      );

    const availableQty = match[1];

    // Fill the extracted quantity
    await quantityInput.fill(availableQty);

    // Verify the value
    await expect(quantityInput).toHaveValue(availableQty);

    // Click the Add button
    await page.locator('//button[text()="Add"]').click();
  }
  await expect(page.locator("text=Submit")).toBeVisible();
});
