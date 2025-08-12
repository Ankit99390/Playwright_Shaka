require('dotenv').config();
const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/cottonwise/loginPage');
const { ManufacturingPage } = require('../pages/cottonwise/manufacturingPage');
const { DispatchPage } = require('../pages/cottonwise/dispatchPage');
const { sharedVariables } = require('../pages/sharedVariables');


test.describe.serial('Order Flow', () => {


test.beforeEach('Cottonwise login', async ({ page }) => {
  test.setTimeout(60000);

  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginActions(process.env.COTTONWISE_USERNAME, process.env.COTTONWISE_PASSWORD);
});

test('Manufacturing', async ({ page }) => {
  test.setTimeout(60000);

    const manufacturingPage = new ManufacturingPage(page);
    await manufacturingPage.clickManufacturingMenu();
    await manufacturingPage.clickStatusDropdown();
    await manufacturingPage.clickBulkManufacturingBtn();
    await manufacturingPage.clickRecordBoolean();
    await manufacturingPage.getLotNumber();
    const producedQuantities = await manufacturingPage.fillProducedQtyWithDemandQty();
    await manufacturingPage.clickSaveAsDraftBtn();
    await manufacturingPage.clickValidateBtn();
    await manufacturingPage.clearFilter();
    await manufacturingPage.seachByLot();
    await manufacturingPage.detailedViewAssertions(producedQuantities);
});

test('Dispatch', async ({ page }) => {
  test.setTimeout(60000);

  const dispatchPage = new DispatchPage(page);
  await dispatchPage.clickDispatchMenu();
  await dispatchPage.clickDispatchStatusDropdown();
  await dispatchPage.searchByLot();
  await dispatchPage.openRecord();
  await dispatchPage.detailedViewAssertions();
  await dispatchPage.dispatchActions();
  await dispatchPage.dispatchedAssertions();
});

});

