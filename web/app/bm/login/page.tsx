'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/bm/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? '로그인에 실패했습니다.');
        setLoading(false);
        return;
      }
      const next = params.get('next') || '/bm';
      router.replace(next);
      router.refresh();
    } catch {
      setError('네트워크 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', padding: 20 }}>
      <form
        onSubmit={submit}
        style={{ width: '100%', maxWidth: 360, background: '#ffffff', borderRadius: 16, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}
      >
        <div style={{ fontSize: 18, fontWeight: 950, color: '#0f172a' }}>MONO BM 검증 보드</div>
        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 6 }}>
          내부 전용 페이지입니다. 접근 비밀번호를 입력하세요.
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          autoFocus
          style={{ padding: '11px 14px', border: '1px solid #cbd5e1', borderRadius: 10, fontSize: 14 }}
        />
        {error && <div style={{ fontSize: 12.5, color: '#dc2626', fontWeight: 700 }}>{error}</div>}
        <button
          type="submit"
          disabled={loading || password.length === 0}
          style={{
            padding: '11px 14px', background: loading ? '#94a3b8' : '#4f46e5', color: '#fff', border: 'none',
            borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: loading ? 'default' : 'pointer',
          }}
        >
          {loading ? '확인 중…' : '입장하기'}
        </button>
      </form>
    </div>
  );
}

export default function BmLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
