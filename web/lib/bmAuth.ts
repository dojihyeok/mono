// /bm 내부 BM 검증 페이지 접근통제 (v1.2 §2) — 공유 비밀번호 + 서명된 세션 쿠키.
// Edge(middleware)와 Node(route handler) 양쪽에서 동일하게 동작하도록 Web Crypto(crypto.subtle)만 사용한다.

export type BmRole = 'admin' | 'mentor';

export const BM_SESSION_COOKIE = 'mono_bm_session';
export const BM_LOGIN_PATH = '/bm/login';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12시간

function getSecret(): string {
  const secret = process.env.BM_SESSION_SECRET;
  if (!secret) throw new Error('BM_SESSION_SECRET 환경변수가 설정되지 않았습니다.');
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

export async function signBmSession(role: BmRole): Promise<string> {
  const payload = `${role}.${Date.now() + SESSION_TTL_MS}`;
  const sig = await hmacSign(payload);
  return `${toBase64Url(new TextEncoder().encode(payload))}.${sig}`;
}

export async function verifyBmSession(token: string | undefined | null): Promise<BmRole | null> {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  let payload: string;
  try {
    payload = new TextDecoder().decode(fromBase64Url(payloadB64));
  } catch {
    return null;
  }
  const expectedSig = await hmacSign(payload);
  if (expectedSig !== sig) return null;
  const [role, expiryStr] = payload.split('.');
  if (role !== 'admin' && role !== 'mentor') return null;
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return null;
  return role;
}

export function resolveRoleFromPassword(password: string): BmRole | null {
  if (password.length > 0 && password === process.env.BM_ADMIN_PASSWORD) return 'admin';
  if (password.length > 0 && password === process.env.BM_MENTOR_PASSWORD) return 'mentor';
  return null;
}
