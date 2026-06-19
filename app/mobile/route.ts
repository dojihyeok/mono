import { serveHtmlFromFile } from '@/lib/htmlServer';

export async function GET() {
  return serveHtmlFromFile(['사용자', '앱']);
}
