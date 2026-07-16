import { Landmark, Smartphone, KeyRound, ShieldCheck, Megaphone, Users } from 'lucide-react';
import { COLOR, VerticalBigPicture, type ChainStep } from './graphicPrimitives';

const launchFlow: ChainStep[] = [
  { icon: Landmark, title: '건설올패스', color: COLOR.navy, background: '#EEF2F7' },
  { icon: Smartphone, title: 'MONO', color: COLOR.blue, background: '#EFF6FF' },
  { icon: KeyRound, title: '센스톤', color: COLOR.teal, background: '#ECFEFF' },
  { icon: ShieldCheck, title: 'Field Pass', color: COLOR.purple, background: '#FAF5FF' },
  { icon: Megaphone, title: '모두의창업', color: COLOR.orange, background: '#FFF7ED' },
  { icon: Users, title: '국민 공개', color: COLOR.indigo, background: '#EEF2FF', highlight: true },
];

// ⑥ Public Launch — Chapter 4. 건설올패스에서 시작해 MONO·센스톤·Field Pass를
// 거쳐 모두의창업 4라운드에서 국민에게 공개되기까지의 흐름.
export function PublicLaunchGraphic() {
  return (
    <VerticalBigPicture
      steps={launchFlow}
      titleId="public-launch"
      title="모두의창업 4라운드 대국민 공개까지의 흐름"
      desc="건설올패스에서 시작해 MONO, 센스톤, Field Pass를 거쳐 모두의창업 4라운드에서 국민에게 공개되는 흐름"
    />
  );
}
