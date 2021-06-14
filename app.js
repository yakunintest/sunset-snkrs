// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const stealthPlugin = require("puppeteer-extra-plugin-stealth")();
["chrome.runtime", "navigator.languages"].forEach(a =>
  stealthPlugin.enabledEvasions.delete(a)
);
puppeteer.use(stealthPlugin);

require('dotenv').config();

const url = 'https://www.nike.com/ru/launch/t/womens-dunk-low-purple-pulse';
const email = process.env.EMAIL;
const password = process.env.PASS;


(async () => {
  const browser = await puppeteer.launch({
    args: [
      '--start-maximized', // you can also use '--start-fullscreen'
      '--disable-web-security',
      '--disable-features=IsolateOrigins',
    ],
    ignoreHTTPSErrors: true,
    devtools: true,
    headless: false
  });

  const page = await browser.newPage();
  await page.setViewport({width: 1366, height: 768});

  await page.evaluateOnNewDocument(() => {
    delete navigator.__proto__.webdriver;
  });

  await page.goto(url);
  // Wait for page to finish loading (do not use await!)
  page.waitForNavigation({waitUntil: 'networkidle0'});

  /**
   * ROUND 1 BEGIN
   */
  await page.waitForTimeout(500);
  // #### Login to Account
  await page.waitForSelector('button[data-qa="top-nav-join-or-login-button"]');
  console.log('Login button loaded');
  await page.evaluate(() => document.querySelectorAll('button[data-qa="top-nav-join-or-login-button"]')[0].click())
  console.log("Testing login");
  await page.waitForSelector('.emailAddress');
  await page.waitForTimeout(500);

  // Username
  await page.focus('.emailAddress > input');
  await page.keyboard.type(email);
  await page.waitForTimeout(200);

  // Password
  await page.focus('.password > input');
  await page.keyboard.type(password);
  await page.waitForTimeout(200);

  // Submit
  await page.evaluate(() =>
    document.querySelectorAll(".loginSubmit > input")[0].click()
  );
  await page.waitForTimeout(500);
})();
