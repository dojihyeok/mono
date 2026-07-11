'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SIMULATOR_INPUTS, SIMULATOR_FEATURES, fmtWon } from '@/data/bm/revenue-models';
import { SCENARIO_PRESETS, getScenarioPreset } from '@/data/bm/scenarios';
import { computeResults, stageComment, loadSavedScenarios, saveScenario, deleteScenario } from '@/lib/bm/simulator-engine';
import { track } from '@/lib/analytics';
import type { EvidenceStatus, SavedScenario } from '@/types/bm';

const EVIDENCE_BADGE: Record<EvidenceStatus, { label: string; color: string; bg: string; border: string }> = {
  hypothesis: { label: 'HYPOTHESIS', color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
  benchmark: { label: 'BENCHMARK', color: '#166534', bg: '#f0fdf4', border: '#bbf7d0' },
  estimated: { label: 'ESTIMATED', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  observed: { label: 'OBSERVED', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
};

function EvidenceBadge({ status }: { status: EvidenceStatus }) {
  const b = EVIDENCE_BADGE[status];
  return (
    <span style={{ fontSize: 10.5, fontWeight: 900, color: b.color, background: b.bg, border: `1px solid ${b.border}`, padding: '3px 9px', borderRadius: 6, whiteSpace: 'nowrap' }}>
      {b.label}
    </span>
  );
}

function SimulatorInner() {
  const searchParams = useSearchParams();
  const scenarioParam = searchParams.get('scenario') || 'all';
  const preset = useMemo(() => getScenarioPreset(scenarioParam), [scenarioParam]);

  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);
  const [saved, setSaved] = useState<SavedScenario[]>([]);
  const [scenarioName, setScenarioName] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);

  // scenario 파라미터가 바뀌면(프리셋 최초 진입·드롭다운 전환) 입력값을 다시 계산
  useEffect(() => {
    const initial: Record<string, number> = { ...preset.defaultInputs };
    SIMULATOR_INPUTS.forEach((i) => {
      const q = searchParams.get(i.id);
      if (q !== null && !Number.isNaN(Number(q))) initial[i.id] = Number(q);
    });
    setInputs(initial);
    const fq = searchParams.get('features');
    setEnabledFeatures(fq !== null ? fq.split(',').filter(Boolean) : preset.enabledFeatures);
    track('simulator_scenario_loaded', { scenario: scenarioParam, linked_bm: preset.linkedBmId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioParam]);

  useEffect(() => {
    track('simulator_viewed', {});
    setSaved(loadSavedScenarios());
  }, []);

  // 입력값 변경 시 URL 반영(§10)
  useEffect(() => {
    if (Object.keys(inputs).length === 0) return;
    const params = new URLSearchParams();
    params.set('scenario', scenarioParam);
    Object.entries(inputs).forEach(([k, v]) => params.set(k, String(v)));
    if (enabledFeatures.length) params.set('features', enabledFeatures.join(','));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [inputs, enabledFeatures, scenarioParam]);

  const { cards, totalMonthly, arr, overallStatus } = useMemo(
    () => computeResults(inputs, enabledFeatures),
    [inputs, enabledFeatures],
  );

  const toggleFeature = (id: string) => {
    setEnabledFeatures((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
    track('simulator_feature_toggled', { feature: id, scenario: scenarioParam });
  };

  const handleSave = () => {
    const name = scenarioName.trim() || `${preset.name} · ${new Date().toLocaleDateString('ko-KR')}`;
    const now = new Date().toISOString();
    const record: SavedScenario = {
      id: `${scenarioParam}-${Date.now()}`,
      name,
      linkedBm: preset.linkedBmId,
      inputs,
      enabledFeatures,
      monthly: totalMonthly,
      arr,
      assumptionStatus: overallStatus,
      assumptionVersion: preset.assumptionVersion,
      createdAt: now,
      updatedAt: now,
    };
    setSaved(saveScenario(record));
    setScenarioName('');
    track('simulator_saved', { scenario: scenarioParam, linked_bm: preset.linkedBmId, assumption_status: overallStatus, arr });
  };

  const handleLoad = (s: SavedScenario) => {
    setInputs(s.inputs);
    setEnabledFeatures(s.enabledFeatures);
  };

  const handleDelete = (id: string) => {
    setSaved(deleteScenario(id));
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 1500);
      track('simulator_shared', { scenario: scenarioParam });
    } catch {
      /* noop */
    }
  };

  const savedForThisBm = saved.filter((s) => s.linkedBm === preset.linkedBmId);
  const pct = Math.min(100, (arr / 5e9) * 100);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      {/* ── 상단 ── */}
      <header style={{ background: '#0b132b', padding: '16px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <a href="/bm" onClick={() => track('simulator_returned_to_bm', {})} style={{ fontSize: 13, fontWeight: 800, color: '#a5b4fc', textDecoration: 'none' }}>← /bm</a>
            <span style={{ fontSize: 16, fontWeight: 950, color: '#fff' }}>MONO 수익모델 진화 시뮬레이터</span>
            <EvidenceBadge status={overallStatus} />
          </div>
          <select
            value={scenarioParam}
            onChange={(e) => { window.location.href = `/bm/simulator?scenario=${e.target.value}`; }}
            style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 13, fontWeight: 700 }}
          >
            {SCENARIO_PRESETS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 340px) 1fr', gap: 20 }} className="simulator-grid">
          <style>{`
            @media (max-width: 900px) {
              .simulator-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>

          {/* ── 좌측: 입력 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 12.5, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>1. 성장 지표 입력</div>
              <p style={{ fontSize: 11.5, color: '#94a3b8', margin: '0 0 14px 0' }}>마케팅 분석(/analytics) 지표를 수동 입력합니다. 추후 API 연동 시 자동 반영.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {SIMULATOR_INPUTS.map((i) => (
                  <div key={i.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>{i.label}</label>
                      <span style={{ fontSize: 12, fontWeight: 900, color: '#1d4ed8' }}>{(inputs[i.id] ?? i.def).toLocaleString()} {i.unit}</span>
                    </div>
                    <input
                      type="range" min={i.min} max={i.max} step={i.step} value={inputs[i.id] ?? i.def}
                      onChange={(e) => setInputs((prev) => ({ ...prev, [i.id]: Number(e.target.value) }))}
                      onMouseUp={() => track('simulator_input_changed', { input: i.id, scenario: scenarioParam })}
                      onTouchEnd={() => track('simulator_input_changed', { input: i.id, scenario: scenarioParam })}
                      style={{ width: '100%', accentColor: '#1d4ed8' }}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 12.5, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>2. 기능 개발 트리거</div>
              <p style={{ fontSize: 11.5, color: '#94a3b8', margin: '0 0 14px 0' }}>기능을 켜면 해당 기능이 해금하는 수익모델이 우측에 나타납니다.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SIMULATOR_FEATURES.map((f) => {
                  const on = enabledFeatures.includes(f.id);
                  return (
                    <div key={f.id} style={{ border: `1px solid ${on ? '#1d4ed8' : '#e2e8f0'}`, background: on ? '#eff6ff' : '#fff', borderRadius: 12, padding: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#0b132b', lineHeight: 1.3 }}>{f.name}</div>
                          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 5, background: '#f1f5f9', color: '#64748b' }}>{f.status}</span>
                            <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 5, background: '#f1f5f9', color: '#64748b' }}>PHASE {f.phase}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFeature(f.id)}
                          style={{ flexShrink: 0, width: 40, height: 22, borderRadius: 999, border: 'none', background: on ? '#1d4ed8' : '#cbd5e1', position: 'relative', cursor: 'pointer' }}
                        >
                          <span style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: 999, background: '#fff', transition: 'left 0.15s' }} />
                        </button>
                      </div>
                      <p style={{ fontSize: 11, color: '#64748b', margin: '8px 0 0 0', lineHeight: 1.5 }}>{f.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ── 우측: 결과 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <section style={{ background: '#0b132b', color: '#fff', borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#a5b4fc', textTransform: 'uppercase' }}>예상 연 매출(ARR)</div>
                  <div style={{ fontSize: 34, fontWeight: 950, marginTop: 4 }}>{fmtWon(arr)}</div>
                  <div style={{ fontSize: 13, color: '#a5b4fc', marginTop: 4 }}>월 {fmtWon(totalMonthly)} · 활성 모델 {cards.length}개</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 11.5, color: '#a5b4fc' }}>
                  <div>Pre-A 목표 ARR: 3억~10억</div>
                  <div>Series A 목표 ARR: 20억~50억</div>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ height: 10, background: '#1e293b', borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #34d399, #10b981)', borderRadius: 999, transition: 'width 0.3s' }} />
                </div>
              </div>
              <p style={{ fontSize: 11.5, color: '#93c5fd', marginTop: 12 }}>{stageComment(arr)}</p>
            </section>

            {/* 시나리오 저장 */}
            <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 16, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <input
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                placeholder="시나리오 이름 (선택)"
                style={{ flex: '1 1 200px', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 13 }}
              />
              <button onClick={handleSave} style={{ padding: '9px 16px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>저장</button>
              <button onClick={handleCopyUrl} style={{ padding: '9px 16px', background: '#fff', color: '#1d4ed8', border: '1px solid #1d4ed8', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
                {copyFeedback ? '복사됨 ✓' : 'URL 복사'}
              </button>
            </section>

            {savedForThisBm.length > 0 && (
              <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 10 }}>저장된 시나리오</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {savedForThisBm.map((s) => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, flexWrap: 'wrap' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#0b132b' }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>ARR {fmtWon(s.arr)} · <EvidenceBadge status={s.assumptionStatus} /></div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleLoad(s)} style={{ fontSize: 11, fontWeight: 800, color: '#1d4ed8', background: 'transparent', border: '1px solid #bfdbfe', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>불러오기</button>
                        <button onClick={() => handleDelete(s.id)} style={{ fontSize: 11, fontWeight: 800, color: '#b91c1c', background: 'transparent', border: '1px solid #fecaca', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>삭제</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 해금된 모델 */}
            <section>
              <div style={{ fontSize: 12.5, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 10 }}>3. 해금된 수익모델 &amp; 실행계획</div>
              {cards.length === 0 ? (
                <div style={{ background: '#fff', border: '1.5px dashed #cbd5e1', borderRadius: 14, padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                  좌측에서 기능 개발 트리거를 켜면 해금되는 수익모델이 여기에 표시됩니다.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {cards.map((c, idx) => (
                    <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 18 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: 10.5, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{c.featureName}</div>
                          <div style={{ fontSize: 15, fontWeight: 900, color: '#0b132b', marginTop: 2 }}>{c.modelName}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 18, fontWeight: 950, color: '#1d4ed8' }}>{fmtWon(c.monthly)}<span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>/월</span></div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>연 {fmtWon(c.monthly * 12)}</div>
                          <div style={{ marginTop: 4 }}><EvidenceBadge status={c.evidenceStatus} /></div>
                        </div>
                      </div>
                      <div style={{ marginTop: 10, fontSize: 12, fontFamily: 'monospace', color: '#475569', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 8, padding: '8px 10px' }}>{c.formulaText}</div>
                      <div style={{ marginTop: 10, fontSize: 12, color: '#475569', lineHeight: 1.6 }}><strong style={{ color: '#059669' }}>글로벌 벤치마크</strong> · {c.benchmark}</div>
                      <div style={{ marginTop: 10 }}>
                        <div style={{ fontSize: 10.5, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>실행 계획</div>
                        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#334155', lineHeight: 1.7 }}>
                          {c.plan.map((p, i2) => <li key={i2}>{p}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        <footer style={{ fontSize: 11, color: '#94a3b8', padding: '24px 0 0', borderTop: '1px solid #e2e8f0', marginTop: 24, lineHeight: 1.6 }}>
          <p>※ 계산식의 단가는 2025~2026년 실측 벤치마크(배민 울트라콜 8.8만원, 네이버 플레이스 CPC 50~5,000원, 숨고 리드 1~5만원, ConstructConnect 월 $199, 비드프로 낙찰액 2.2%, 페이워치 건당 900원, Textura 0.22%, ISN 연 $875, Deel EOR 월 $599 등)에 국내 현실화 계수를 적용한 가정치입니다.</p>
          <p style={{ marginTop: 4 }}>BM 진화 시뮬레이터 v2.0 → /bm/simulator 이식 · 계산 로직 원본 그대로 유지, 실제 결제·계약 데이터로 검증되기 전까지는 BENCHMARK/HYPOTHESIS 가정입니다.</p>
        </footer>
      </main>
    </div>
  );
}

export default function SimulatorClient() {
  return (
    <Suspense fallback={null}>
      <SimulatorInner />
    </Suspense>
  );
}
