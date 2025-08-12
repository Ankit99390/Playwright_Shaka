require('dotenv').config();
const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/esun/loginPage');
const { ReceiptPage } = require('../pages/esun/receiptsPage');


  test.beforeEach('Esun login', async ({ page }) => {
    test.setTimeout(60000);

    const loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    await loginPage.loginActions(process.env.ESUN_USERNAME, process.env.ESUN_PASSWORD);
});

test('Receipts', async ({ page }) => {
  test.setTimeout(60000);

  const receiptsPage = new ReceiptPage(page);
  await receiptsPage.clickReceiptsMenu();
  await receiptsPage.applyStatusFilter();
  await receiptsPage.openFirstRecord();
  await receiptsPage.detailedViewAssertions();
  await receiptsPage.clickValidateBtn();
});