import puppeteer from 'puppeteer';
import { config } from './config';
import { extractPdfData } from './helpers/pdfExtractor';
import { fieldMapping } from './helpers/fieldMapper';

async function runFormAssistant() {
  try {
    console.log('Starting AI Form Advocate...');
    
    // 1. Extract data from PDF
    const formData = await extractPdfData(config.pdfPath);
    console.log('Extracted Data:', Object.keys(formData));

    if (Object.keys(formData).length === 0) {
      console.warn('Warning: No structured fields found in PDF.');
      // Continue anyway to test browser connection
    }

    // 2. Launch Browser
    console.log('Launching browser...');
    const browser = await puppeteer.launch(config.browserOptions);
    const page = await browser.newPage();

    // 3. Navigate to Form
    if (config.formUrl) {
      await page.goto(config.formUrl, { waitUntil: 'domcontentloaded' });
      console.log('Navigated to form URL.');
    } else {
      console.error('No FORM_URL provided in .env');
      await browser.close();
      return;
    }

    // 4. Fill Fields
    for (const [key, value] of Object.entries(formData)) {
      const selector = fieldMapping[key];
      if (!selector) continue;
      
      try {
        await page.type(selector, value);
        console.log(`Filled: ${key}`);
      } catch (e) {
        console.warn(`Field ${key} (${selector}) not found or type error.`);
      }
    }

    // NOTE: Uncomment below to actually submit the form
    // await Promise.all([
    //   page.click('input[type="submit"]'),
    //   page.waitForNavigation()
    // ]);

    console.log('Process completed. You can manually save the screenshot now.');
    await browser.close();

  } catch (error) {
    console.error('Fatal Error:', error.message || error);
  }
}

runFormAssistant();
