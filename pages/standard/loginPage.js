const { expect } = require("@playwright/test");

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;

    // adding locators
    this.user_name = page.locator('//input[@name="login"]');
    this.password = page.locator('//input[@name="password"]');
    this.login_btn = page.locator('//button[@type="submit"]');
  }

  // URL redirection
  async gotoLoginPage() {
    await this.page.goto("https://vendor17staging.shakawear.com/login");
  }

  // Login Actions
  async loginActions(username, password) {
    await this.user_name.fill(username);
    await this.password.fill(password);
    await this.login_btn.click();
    await this.page.waitForLoadState("networkidle");
  }
};
