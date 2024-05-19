const chromium = require("@sparticuz/chromium");
import puppeteer from "puppeteer-core";

export class PdfService {
  async convertHtmlToPdf(html: string): Promise<Buffer | null> {
    let result = null;
    let browser = null;
    try {
      console.log("Launching Headless browser");
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });

      console.log("Browser launched");
      const page = await browser.newPage();

      await page.setContent(html, {
        waitUntil: ["domcontentloaded", "networkidle0", "load"],
      });

      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");

      result = await page.pdf({ format: "a4", printBackground: true });
    } catch (e: any) {
      console.log(`Chromium error ${e.stack}`);
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }
    return result;
  }
}
