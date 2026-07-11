// 비공개 데이터룸(투자·TIPS 자료) 접근통제 — 공유 비밀번호 + 서명된 세션 쿠키.
// /bm의 bmAuth.ts와 동일한 방식(Web Crypto HMAC-SHA256)이나, 별도 자격증명·별도 감사 대상이라 파일을 분리한다.

export const DATAROOM_SESSION_COOKIE = 'mono_dataroom_session';
export const DATAROOM_LOGIN_PATH = '/dataroom/login';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12시간

function getSecret(): string {
  const secret = process.env.DATAROOM_SESSION_SECRET;
  if (!secret) throw new Error('DATAROOM_SESSION_SECRET 환경변수가 설정되지 않았습니다.');
  return secret;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let str = '';
  for (const b of arr) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(b64url.length / 4) * 4, '=');
  const str = atob(b64);
  const arr = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) arr[i] = str.charCodeAt(i);
  return arr;
}

async function hmacSign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return toBase64Url(sig);
}

export async function signDataroomSession(): Promise<string> {
  const payload = `authorized.${Date.now() + SESSION_TTL_MS}`;
  const sig = await hmacSign(payload);
  return `${toBase64Url(new TextEncoder().encode(payload))}.${sig}`;
}

export async function verifyDataroomSession(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payloadB64, sig] = parts;
  let payload: string;
  try {
    payload = new TextDecoder().decode(fromBase64Url(payloadB64));
  } catch {
    return false;
  }
  const expectedSig = await hmacSign(payload);
  if (expectedSig !== sig) return false;
  const [tag, expiryStr] = payload.split('.');
  if (tag !== 'authorized') return false;
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;
  return true;
}

export function checkDataroomPassword(password: string): boolean {
  return password.length > 0 && password === process.env.DATAROOM_PASSWORD;
}
