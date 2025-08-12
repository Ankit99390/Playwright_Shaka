require('dotenv').config();
const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/odoo/loginPage');
const { PurchaseOrderPage } = require('../pages/odoo/purchaseOrderPage');

test.beforeEach('Odoo login', async ({ page }) => {
  test.setTimeout(60000);
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.loginActions(process.env.ODOO_USERNAME, process.env.ODOO_PASSWORD);
});

test('Create Purchase Order', async ({ page }) => {
  test.setTimeout(60000);
  const purchaseOrderPage = new PurchaseOrderPage(page);
  await purchaseOrderPage.gotoPurchaseOrderPage();
  await purchaseOrderPage.createNewOrder();
  await purchaseOrderPage.addVendor('Standard Apparel');
  await purchaseOrderPage.addVendorRef();
  await purchaseOrderPage.addProducts('GDS');
  await purchaseOrderPage.addRolls();
  await purchaseOrderPage.addRandomFutureLot();
  await purchaseOrderPage.detailedPageAssertions();
  await purchaseOrderPage.goToListPage();
  await purchaseOrderPage.searchPO();
  await purchaseOrderPage.listPageAssertions();
});