import { LoginPage } from "../pages/loginPage";
import { PaginationRecord } from "../pages/paginationRecord";
import { RecordSort } from "../pages/sortingRecord";
import { HideStatus } from "../pages/hideStatus";
import { test } from "@playwright/test";

test("RecordCountCheck", async ({ page }) => {

  const login = new LoginPage(page);
  await login.gotoLoginPage();
  await login.loginActions("wjkim@cottonwise.com", "1234");

  const manufacturingPage = new PaginationRecord(page);
  await manufacturingPage.goToManufacturingPage();
  await manufacturingPage.recordCountMatch(20);
});


test("SKUsort", async ({ page }) => {

  const login = new LoginPage(page);
  await login.gotoLoginPage();
  await login.loginActions("li@esunhn.com", "1234");

  const listPage = new RecordSort(page);
  await listPage.goToListView();
  await listPage.sortSku();
});


  test.only("Status", async ({ page }) => {

  const login = new LoginPage(page);
  await login.gotoLoginPage();
  await login.loginActions("li@esunhn.com", "1234");

  const listPage = new HideStatus(page);
  await listPage.goToDispatchPage();
  await listPage.applyFilter('Waiting', 0);
});