import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  formUrl: process.env.FORM_URL || '',
  pdfPath: process.env.PDF_FILE || './data/sample.pdf',
  browserOptions: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
};
