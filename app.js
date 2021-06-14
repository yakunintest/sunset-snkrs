const puppeteer = require('puppeteer-extra');
const pluginStealth = require("puppeteer-extra-plugin-stealth");

(async () => {
  const browser = await puppeteer.launch({devtools: true, headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.nike.com/ru');
})();
