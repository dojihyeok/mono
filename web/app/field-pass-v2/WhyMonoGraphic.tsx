import { Landmark, FileCheck, Smartphone, DoorOpen, Clock, Briefcase, Star, ShieldCheck } from 'lucide-react';
import { COLOR, VerticalBigPicture, type ChainStep } from './graphicPrimitives';

const steps: ChainStep[] = [
  { icon: Landmark, title: '건설올패스', color: COLOR.navy, background: '#EEF2F7' },
  { icon: FileCheck, title: '공적 근로기록', color: '#334155', background: '#F1F5F9' },
  { icon: Smartphone, title: 'MONO App', color: COLOR.blue, background: '#EFF6FF' },
  { icon: DoorOpen, title: '출입', color: COLOR.green, background: '#F0FDF4' },
  { icon: Clock, title: '출근', color: COLOR.orange, background: '#FFF7ED' },
  { icon: Briefcase, title: '경력', color: COLOR.purple, background: '#FAF5FF' },
  { icon: Star, title: '신뢰', color: COLOR.teal, background: '#ECFEFF' },
  { icon: ShieldCheck, title: '권한', color: COLOR.indigo, background: '#EEF2FF', highlight: true },
];

// ① Why MONO — Chapter 1의 "큰 그림 하나". 텍스트는 제목만, 세로 흐름 하나로
// "건설올패스 → MONO Field Pass"가 무엇을 하는지 30초 안에 보여준다.
export function WhyMonoGraphic() {
  return (
    <VerticalBigPicture
      steps={steps}
      titleId="why-mono"
      title="왜 MONO Field Pass인가"
      desc="건설올패스의 공적 근로기록이 MONO App을 통해 출입, 출근, 경력, 신뢰, 권한으로 이어지는 큰 흐름"
    />
  );
}
