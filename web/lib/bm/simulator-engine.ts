// /bm/simulator 계산 엔진 + localStorage 시나리오 저장 (v1.3 §11, §13)
import { SIMULATOR_FEATURES, fmtWon } from '@/data/bm/revenue-models';
import type { EvidenceStatus, SavedScenario } from '@/types/bm';

export { fmtWon };

export interface ComputedModelCard {
  featureId: string;
  featureName: string;
  modelName: string;
  formulaText: string;
  benchmark: string;
  plan: string[];
  monthly: number;
  evidenceStatus: EvidenceStatus;
}

export function computeResults(inputs: Record<string, number>, enabledFeatureIds: string[]) {
  const active = SIMULATOR_FEATURES.filter((f) => enabledFeatureIds.includes(f.id));
  const cards: ComputedModelCard[] = [];
  let totalMonthly = 0;

  active.forEach((f) => {
    f.models.forEach((m) => {
      const monthly = m.calc(inputs);
      totalMonthly += monthly;
      cards.push({
        featureId: f.id,
        featureName: f.name,
        modelName: m.name,
        formulaText: m.formulaText,
        benchmark: m.benchmark,
        plan: m.plan,
        monthly,
        evidenceStatus: m.evidenceStatus,
      });
    });
  });

  cards.sort((a, b) => b.monthly - a.monthly);
  const arr = totalMonthly * 12;

  // 활성 모델 중 가장 신뢰도 낮은(=가설에 가까운) 상태를 시나리오 전체 대표 상태로 사용
  const RANK: Record<EvidenceStatus, number> = { observed: 3, estimated: 2, benchmark: 1, hypothesis: 0 };
  const overallStatus: EvidenceStatus = cards.length
    ? cards.reduce((min, c) => (RANK[c.evidenceStatus] < RANK[min] ? c.evidenceStatus : min), cards[0].evidenceStatus)
    : 'hypothesis';

  return { cards, totalMonthly, arr, overallStatus };
}

export function stageComment(arr: number): string {
  if (arr === 0) return '기능 트리거를 켜서 진화 시나리오를 시뮬레이션해 보십시오.';
  if (arr < 3e8) return '현재 조합은 Pre-A 목표(ARR 3억) 미달입니다. Phase 1~2 트리거 추가 또는 지표 성장이 필요합니다.';
  if (arr < 1e9) return 'Pre-A 목표 구간(3억~10억) 진입. 투자 유치 전략 문서의 Pre-A 마일스톤과 정합합니다.';
  if (arr < 2e9) return 'Pre-A 상단 돌파. Series A 진입을 위해 금융·네트워크형(Phase 3) 트리거 가동을 검토하십시오.';
  return 'Series A 목표 구간(ARR 20억+) 도달 시나리오입니다. 유료 기업 100~300개사·기술자 5만~10만 명 지표와 교차 검증하십시오.';
}

// ── localStorage 시나리오 저장 (§11) ──
const STORAGE_KEY = 'mono.bm.savedScenarios';

export function loadSavedScenarios(): SavedScenario[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedScenario[]) : [];
  } catch {
    return [];
  }
}

export function saveScenario(scenario: SavedScenario): SavedScenario[] {
  const all = loadSavedScenarios();
  const idx = all.findIndex((s) => s.id === scenario.id);
  if (idx >= 0) all[idx] = scenario;
  else all.unshift(scenario);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return all;
}

export function deleteScenario(id: string): SavedScenario[] {
  const all = loadSavedScenarios().filter((s) => s.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return all;
}
