import { notFound } from "next/navigation";
import { PublicProfileView } from "@/components/PublicProfileView";
import { computeCompletion } from "@/lib/completion";
import { CAREER_BAND_LABEL } from "@/lib/constants";

const API = process.env.API_URL ?? "http://localhost:8000";

// 공개 프로필 페이지 — 공유 링크(QR)로 진입. 서버에서 api 조회 후 렌더.
export default async function PublicProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(`${API}/users/${params.id}/public`, {
    cache: "no-store",
  }).catch(() => null);

  if (!res || !res.ok) notFound();
  const data = await res.json();

  // "YYYY-MM" 으로 축약(서버는 ISO datetime 반환)
  const ym = (d?: string | null) => (d ? String(d).slice(0, 7) : undefined);

  const user = {
    id: data.user.id,
    name: data.user.name ?? null,
    jobType: data.user.jobType ?? [],
    careerYears: data.user.careerYears
      ? CAREER_BAND_LABEL[data.user.careerYears] ?? data.user.careerYears
      : null,
    region: data.user.region ?? [],
    createdAt: data.user.createdAt,
  };

  const careerCards = (data.careerCards ?? []).map((c: any) => ({
    id: c.id,
    siteName: c.siteName,
    field: c.field ?? undefined,
    startDate: ym(c.startDate),
    endDate: ym(c.endDate),
    role: c.role ?? undefined,
    equipment: c.equipment ?? undefined,
    // coworkers(제3자 실명)·memo(사적 메모)는 공개 프로필에 포함하지 않음
    createdAt: c.createdAt,
  }));

  const certificates = (data.certificates ?? []).map((c: any) => ({
    id: c.id,
    name: c.name,
    licenseNo: "", // 발급번호는 공개하지 않음(표시 안 함)
    issuer: c.issuer ?? undefined,
    issuedAt: ym(c.issuedAt),
    createdAt: c.createdAt,
  }));

  const educations = (data.educations ?? []).map((e: any) => ({
    id: e.id,
    title: e.title,
    institute: e.institute ?? undefined,
    completedAt: ym(e.completedAt),
    createdAt: e.createdAt,
  }));

  const completion = computeCompletion({
    user,
    careerCards,
    certificates,
    educations,
    interests: [],
    shareId: null,
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f1ea",
        display: "flex",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "460px" }}>
        <PublicProfileView
          user={user}
          careerCards={careerCards}
          certificates={certificates}
          educations={educations}
          completion={completion}
        />
      </div>
    </main>
  );
}
