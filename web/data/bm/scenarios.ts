// BM별 시나리오 프리셋 (내부 BM 검증 페이지 개선 개발 요청서 v1.3 §9)
import type { BMScenario } from '@/types/bm';
import { SIMULATOR_INPUTS } from './revenue-models';

const DEFAULT_INPUTS = Object.fromEntries(SIMULATOR_INPUTS.map((i) => [i.id, i.def]));

export const SCENARIO_PRESETS: BMScenario[] = [
  {
    id: 'urgent-posting',
    name: '급구 현장 공고',
    linkedBmId: 'job-posting',
    defaultInputs: DEFAULT_INPUTS,
    enabledFeatures: ['mapOffice'],
    assumptionVersion: 'v1.3',
  },
  {
    id: 'workspace',
    name: 'Partner Workspace',
    linkedBmId: 'workspace-subscription',
    defaultInputs: DEFAULT_INPUTS,
    enabledFeatures: ['attendance', 'trust'],
    assumptionVersion: 'v1.3',
  },
  {
    id: 'foreign-hub',
    name: '외국인 허브',
    linkedBmId: 'foreign-hub',
    defaultInputs: DEFAULT_INPUTS,
    enabledFeatures: ['foreign'],
    assumptionVersion: 'v1.3',
  },
  {
    id: 'field-pass',
    name: 'MONO Field Pass',
    linkedBmId: 'field-pass',
    defaultInputs: DEFAULT_INPUTS,
    enabledFeatures: ['trust', 'attendance', 'pass'],
    assumptionVersion: 'v1.3',
  },
  {
    id: 'all',
    name: '전체 BM 진화',
    linkedBmId: 'all',
    defaultInputs: DEFAULT_INPUTS,
    enabledFeatures: [],
    assumptionVersion: 'v1.3',
  },
];

export function getScenarioPreset(id: string | null): BMScenario {
  return SCENARIO_PRESETS.find((s) => s.id === id) ?? SCENARIO_PRESETS[SCENARIO_PRESETS.length - 1];
}
