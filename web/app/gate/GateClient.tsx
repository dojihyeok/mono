'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function GateClient() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/site-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      window.location.href = next;
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b1224', padding: 20, fontFamily: 'var(--font-sans)' }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 340, background: '#fff', borderRadius: 16, padding: '32px 28px', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
        <div style={{ fontSize: 15, fontWeight: 950, color: '#0a0f1a', marginBottom: 6 }}>MONO</div>
        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 20 }}>비밀번호를 입력해 주세요</div>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          placeholder="Password"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px 14px',
            fontSize: 14,
            borderRadius: 10,
            border: error ? '1.5px solid #dc2626' : '1px solid #e2e8f0',
            outline: 'none',
            marginBottom: error ? 8 : 20,
          }}
        />
        {error && (
          <div style={{ fontSize: 12.5, color: '#dc2626', fontWeight: 650, marginBottom: 12 }}>비밀번호가 올바르지 않습니다.</div>
        )}
        <button
          type="submit"
          disabled={loading || !password}
          style={{
            width: '100%',
            padding: '13px 0',
            background: loading || !password ? '#c7c9f5' : '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 900,
            cursor: loading || !password ? 'default' : 'pointer',
          }}
        >
          입장하기
        </button>
      </form>
    </div>
  );
}
