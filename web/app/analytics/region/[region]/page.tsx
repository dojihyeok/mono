import { REGIONS } from "@/lib/constants";
import { RegionLandingClient } from "./RegionLandingClient";

export function generateStaticParams() {
  return REGIONS.map((region) => ({ region: encodeURIComponent(region) }));
}

export function generateMetadata({ params }: { params: { region: string } }) {
  const region = decodeURIComponent(params.region);
  return {
    title: `${region} 현장 급구 공고 — MONO`,
    description: `${region} 지역 현장의 급구 공고를 확인하고 지원하세요.`,
  };
}

export default function RegionPage({ params }: { params: { region: string } }) {
  return <RegionLandingClient region={decodeURIComponent(params.region)} />;
}
