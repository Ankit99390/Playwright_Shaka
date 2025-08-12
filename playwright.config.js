// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  projects: [
    {
      name: "Chromium",
      use: { browserName: "chromium" },
    },
    {
      name: "Firefox",
      use: { browserName: "firefox" },
    },
    {
      name: "WebKit",
      use: { browserName: "webkit" },
    },
  ],
});

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  timeout: 60000 * 20, // 60s for each test
  expect: {
    timeout: 30000 * 20, // 30s for all expect() assertions
  },
  
});


/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  projects: [
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
        channel: 'chrome',        // use installed Google Chrome
        headless: false,          // change to true if you want headless
      },
    },
  ],
};
module.exports = config;
