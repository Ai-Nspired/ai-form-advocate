import { IHavePDF, helpers } from 'ihatepdf';
import fs from 'fs';

export async function extractPdfData(filePath: string): Promise<Record<string, string>> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`PDF not found: ${filePath}. Place a sample.pdf in ./data/ first.`);
  }

  const pdf: IHavePDF = new helpers.IHavePDF();
  await pdf.openFromLocalFile(filePath);
  const rawText = await pdf.extractText();
  await pdf.close();

  const data: Record<string, string> = {};
  // Basic key-value extraction (adjust regex for your specific PDF format)
  rawText.split('\n').forEach((line) => {
    const match = line.match(/^(.*?):\s*(.*)$/);
    if (match) {
      data[match[1].trim()] = match[2].trim();
    }
  });
  
  return data;
}
