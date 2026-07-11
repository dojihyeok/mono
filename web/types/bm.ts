// /bm, /bm/simulator 공용 타입 (내부 BM 검증 페이지 개선 개발 요청서 v1.3 §13)

export type EvidenceStatus = 'hypothesis' | 'benchmark' | 'estimated' | 'observed';

export interface SimulatorInput {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  def: number;
  unit: string;
}

export interface RevenueModel {
  name: string;
  formulaText: string;
  calc: (v: Record<string, number>) => number;
  benchmark: string;
  plan: string[];
  evidenceStatus: EvidenceStatus;
}

export interface SimulatorFeature {
  id: string;
  phase: 0 | 1 | 2 | 3;
  name: string;
  status: string;
  statusCls: string;
  desc: string;
  models: RevenueModel[];
}

export interface BMScenario {
  id: string;
  name: string;
  linkedBmId: string;
  defaultInputs: Record<string, number>;
  enabledFeatures: string[];
  assumptionVersion: string;
}

// localStorage에 저장되는 사용자 시나리오(§11)
export interface SavedScenario {
  id: string;
  name: string;
  linkedBm: string;
  inputs: Record<string, number>;
  enabledFeatures: string[];
  monthly: number;
  arr: number;
  assumptionStatus: EvidenceStatus;
  assumptionVersion: string;
  createdAt: string;
  updatedAt: string;
  memo?: string;
}
