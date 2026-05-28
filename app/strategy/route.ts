import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'pitch.html');
    const html = await fs.readFile(filePath, 'utf8');
    
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    return new Response('Error loading page', { status: 500 });
  }
}
