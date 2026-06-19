import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Searches the 'new mono' directory for an HTML file whose name contains all of the specified keywords,
 * normalized to NFC for robust cross-platform matching. Serves the file as HTML.
 */
export function serveHtmlFromFile(keywords: string[]) {
  try {
    const dirPath = path.join(process.cwd(), 'new mono');
    if (!fs.existsSync(dirPath)) {
      return new NextResponse(`Directory not found: ${dirPath}`, { status: 404 });
    }

    const files = fs.readdirSync(dirPath);
    
    // Normalize target keywords to NFC
    const normalizedKeywords = keywords.map(kw => kw.normalize('NFC'));

    // Find the file that contains all keywords
    const matchedFile = files.find(file => {
      const normalizedFileName = file.normalize('NFC');
      return normalizedKeywords.every(kw => normalizedFileName.includes(kw)) && file.endsWith('.html');
    });

    if (!matchedFile) {
      return new NextResponse(
        `HTML file matching keywords [${keywords.join(', ')}] not found in 'new mono' directory.`,
        { status: 404 }
      );
    }

    const filePath = path.join(dirPath, matchedFile);
    const htmlContent = fs.readFileSync(filePath, 'utf-8');

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('Error serving HTML file:', error);
    return new NextResponse(`Server Error: ${error.message}`, { status: 500 });
  }
}
