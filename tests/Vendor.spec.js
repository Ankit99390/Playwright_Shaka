import { LoginPage } from "../pages/loginPage";
import { ManufacturingPage } from "../pages/manufacturingPage";
import { DispatchPage } from "../pages/dispatchPage";
import { test } from "@playwright/test";

test("Maufacturing", async ({ page }) => {
  const sharedData = {};

  // Step 1: Login
  const login = new LoginPage(page);
  await login.gotoLoginPage();
  await login.loginActions("li@esunhn.com", "1234");

  // Step 2: Manufacturing
  const manufacture = new ManufacturingPage(page);
  await manufacture.goToMaufacturing(sharedData);

  console.log(sharedData);

  // Step 3: Dispatch
  const dispatch = new DispatchPage(page, sharedData);
  await dispatch.goToDispatch();
});

// test("Dispatch", async ({ page }) => {
//   const sharedData = {};

//   // Login
//   const login = new LoginPage(page);
//   await login.gotoLoginPage();
//   await login.loginActions("li@esunhn.com", "1234");

//   // Dispatch
//   const dispatch = new DispatchPage(page, sharedData);
//   await dispatch.goToDispatch();
// });