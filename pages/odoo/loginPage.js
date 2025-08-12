const { expect } = require("@playwright/test");

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;

    // adding locators
    this.url = "https://odoo17staging.shakawear.com/web/login";
    // this.url = "http://74.179.59.115:8016/web/login";
    this.email = page.locator('//input[@name="login"]');
    this.password = page.locator('//input[@name="password"]');
    this.login_btn = page.locator('//button[text()= "Log in"]');
  }

  // URL redirection
  async gotoLoginPage() {
    await this.page.goto(this.url);
  }

  // Login Actions
  async loginActions(username, password) {
    await this.email.fill(username);
    await this.password.fill(password);
    await this.login_btn.click();
  }
};
