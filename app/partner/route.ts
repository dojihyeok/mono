import { serveHtmlFromFile } from '@/lib/htmlServer';

export async function GET() {
  return serveHtmlFromFile(['기업용']);
}
