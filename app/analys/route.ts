import { serveHtmlFromFile } from '@/lib/htmlServer';

export async function GET() {
  return serveHtmlFromFile(['마케팅']);
}
