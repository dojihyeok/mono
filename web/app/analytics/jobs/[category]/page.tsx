import { JOB_TYPES } from "@/lib/constants";
import { JobLandingClient } from "./JobLandingClient";

export function generateStaticParams() {
  return JOB_TYPES.filter((j) => j !== "기타").map((category) => ({ category: encodeURIComponent(category) }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const category = decodeURIComponent(params.category);
  return {
    title: `${category} 기술자 채용 공고 — MONO`,
    description: `${category} 경력·자격·교육 이력을 프로필로 만들고 맞는 현장 공고에 지원하세요.`,
  };
}

export default function JobCategoryPage({ params }: { params: { category: string } }) {
  return <JobLandingClient category={decodeURIComponent(params.category)} />;
}
