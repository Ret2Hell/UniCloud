import * as fs from 'fs';
import * as pdf from 'pdf-parse';

export async function parsePdf(filePath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const { text } = await pdf(dataBuffer);
    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`PDF parsing failed: ${error.message}`);
    }
    throw new Error('PDF parsing failed due to an unknown error.');
  }
}
