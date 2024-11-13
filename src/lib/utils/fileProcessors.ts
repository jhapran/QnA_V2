import * as XLSX from 'xlsx';
import * as mammoth from "mammoth";
import * as pdfjsLib from 'pdfjs-dist';
import { getDocument } from 'pdfjs-dist/build/pdf';

// Configure PDF.js worker
const pdfjsWorkerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;

export async function processTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        resolve(text);
      } else {
        reject(new Error('Failed to read text file'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export async function processPDFFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }

    const processedText = fullText.trim();
    if (!processedText) {
      throw new Error('No text content found in PDF');
    }

    return processedText;
  } catch (error) {
    console.error('PDF processing error:', error);
    throw new Error('Failed to process PDF file. Please ensure the file is not corrupted or password protected.');
  }
}

export async function processDocxFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value.trim();
    if (!text) {
      throw new Error('No text content found in DOCX file');
    }
    return text;
  } catch (error) {
    console.error('DOCX processing error:', error);
    throw new Error('Failed to process DOCX file. Please ensure the file is not corrupted.');
  }
}

export async function processExcelFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    let fullText = '';
    
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const sheetText = XLSX.utils.sheet_to_txt(worksheet, { blankrows: false });
      if (sheetText.trim()) {
        fullText += `Sheet: ${sheetName}\n${sheetText}\n\n`;
      }
    });

    if (!fullText.trim()) {
      throw new Error('No text content found in Excel file');
    }

    return fullText.trim();
  } catch (error) {
    console.error('Excel processing error:', error);
    throw new Error('Failed to process Excel file. Please ensure the file is not corrupted.');
  }
}

export async function processFile(file: File): Promise<string> {
  const fileType = file.name.split('.').pop()?.toLowerCase();

  try {
    switch (fileType) {
      case 'txt':
      case 'md':
        return processTextFile(file);
      case 'pdf':
        return processPDFFile(file);
      case 'docx':
        return processDocxFile(file);
      case 'xlsx':
      case 'xls':
        return processExcelFile(file);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Document processing error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to process file');
  }
}