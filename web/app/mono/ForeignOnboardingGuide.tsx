"use client";

// 외국인 기술자 온보딩 콘텐츠 (dev-plan-foreign-workforce §8-2).
// 한국어(KO), 영어(EN), 베트남어(VI) 다국어 지원 탑재로 현장 적응 퀄리티 비약적 고도화.
// 줄바꿈 강제 태그(<br>)를 배제하고 word-break와 flexbox를 활용한 반응형 레이아웃 구성.
import { CSSProperties, useState } from "react";

const TEXT = "var(--app-text,#4f46e5)";
const SUB = "#5b6b82";
const FAINT = "#8694a8";
const BORDER = "#eef0f6";
const C1 = "var(--c1,#4f46e5)";
const SOFT = "var(--aSoft,#ecedfb)";

const card: CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: 16,
  border: `1px solid ${BORDER}`,
  marginBottom: 12,
};

const langTabContainer: CSSProperties = {
  display: "flex",
  gap: 8,
  marginBottom: 14,
};

interface GuideContent {
  title: string;
  body: string;
}

const GUIDES_LANG: Record<string, GuideContent[]> = {
  KO: [
    {
      title: "한국 현장 문화",
      body: "한국 현장은 출근 시간을 매우 중요하게 생각해요. 보통 작업 시작 10~15분 전에 도착해 준비합니다. 모르는 작업은 혼자 추측하지 말고 반장이나 동료에게 바로 물어보세요. 먼저 인사하고 안전 상태를 확인하면 신뢰를 빠르게 얻을 수 있어요.",
    },
    {
      title: "안전교육 핵심",
      body: "현장에 들어가기 전 기초안전보건교육 이수가 필요해요. 안전모·안전화·안전벨트 같은 보호구는 항상 착용합니다. 위험해 보이는 작업은 멈추고 반장에게 알리세요. 사고가 나면 숨기지 말고 즉시 보고하는 것이 가장 중요해요.",
    },
    {
      title: "임금·계약 기본",
      body: "일을 시작하기 전 근로계약서를 받아 시급·근무시간·지급일을 꼭 확인하세요. 한국은 최저임금이 법으로 정해져 있고, 연장·야간·휴일 근로에는 추가 수당이 붙어요. 급여명세서와 출근 기록은 직접 보관해 두면 나중에 큰 도움이 됩니다.",
    },
    {
      title: "숙소·식사·교통",
      body: "숙소·식사·교통이 제공되는지, 비용을 본인이 내는지 계약할 때 확인하세요. 숙소비나 식비를 임금에서 빼는 경우 금액과 기준을 미리 알아두는 게 좋아요. 현장까지 가는 방법과 걸리는 시간도 첫 출근 전에 확인해 두세요.",
    },
    {
      title: "신고·상담 안내",
      body: "임금을 제때 못 받거나(임금체불) 일하다 다쳤을 때(산업재해)는 신고하고 도움을 받을 수 있어요. 이는 외국인 기술자에게도 똑같이 보장되는 권리예요. 혼자 해결하기 어려우면 MONO의 행정·노무 파트너 연계나 외국인 상담 창구의 도움을 받으세요. 실제 신고 접수는 별도 기능에서 진행돼요.",
    },
    {
      title: "한국어 현장 용어 학습",
      body: "현장에서 자주 쓰는 공구·작업·안전 용어를 미리 익혀 두면 소통이 훨씬 쉬워져요. '용어' 탭에서 산업별 용어팩을 모국어 뜻과 함께 확인할 수 있어요. 자주 듣는 단어부터 외우고, 못 알아들으면 다시 한 번 천천히 말해 달라고 요청하세요.",
    },
  ],
  EN: [
    {
      title: "Korean Field Culture",
      body: "Korean construction sites highly value punctuality. Typically, workers arrive 10 to 15 minutes before work begins to prepare. Do not guess how to perform unfamiliar tasks; ask the foreman or colleagues immediately. Greet others first and check safety conditions to quickly build trust.",
    },
    {
      title: "Core Safety Training",
      body: "You must complete the Basic Safety and Health Training before entering a site. Always wear protective gear such as helmets, safety shoes, and safety belts. Stop working and notify the foreman if you spot any hazards. Reporting accidents immediately without hiding them is crucial.",
    },
    {
      title: "Wages and Contracts",
      body: "Receive a labor contract before starting work and verify the hourly wage, working hours, and payment dates. South Korea guarantees a minimum wage by law, and overtime, night, or holiday shifts receive additional premiums. Keeping pay stubs and attendance logs yourself will help greatly later.",
    },
    {
      title: "Accommodation, Meals, and Transport",
      body: "Check during contracting whether housing, meals, and transportation are provided and who covers the costs. If accommodation or food costs are deducted from wages, understand the rates and terms beforehand. Plan how to reach the site and verify travel times before your first day.",
    },
    {
      title: "Filing Reports and Counseling",
      body: "If you experience unpaid wages or get injured at work (industrial accident), you can file reports and receive assistance. These rights are equally guaranteed for foreign workers. If resolving it alone is difficult, seek help from MONO's administration/labor partners or foreign counselor helpdesks.",
    },
    {
      title: "Learning Construction Korean",
      body: "Learning frequently used tools, tasks, and safety terms beforehand makes communication much easier. You can check industry-specific glossary packs with translations in the 'Glossary' tab. Focus on words you hear often, and politely ask to speak slowly if you do not understand.",
    },
  ],
  VI: [
    {
      title: "Văn hóa công trường Hàn Quốc",
      body: "Các công trường ở Hàn Quốc đánh giá rất cao việc đi làm đúng giờ. Thông thường, công nhân sẽ đến trước khi bắt đầu công việc 10-15 phút để chuẩn bị. Đừng tự suy đoán các công việc chưa quen thuộc; hãy hỏi quản đốc hoặc đồng nghiệp ngay lập tức. Hãy chào hỏi trước và kiểm tra các điều kiện an toàn để nhanh chóng xây dựng lòng tin.",
    },
    {
      title: "Cốt lõi của đào tạo an toàn",
      body: "Bạn phải hoàn thành Khóa đào tạo cơ bản về an toàn và sức khỏe trước khi vào công trường. Luôn đeo thiết bị bảo hộ như mũ bảo hiểm, giày an toàn và dây đai an toàn. Hãy dừng công việc lại và báo cho quản đốc nếu bạn phát hiện bất kỳ mối nguy hiểm nào. Việc báo cáo tai nạn ngay lập tức mà không che giấu là điều vô cùng quan trọng.",
    },
    {
      title: "Khái niệm cơ bản về lương và hợp đồng",
      body: "Nhận hợp đồng lao động trước khi bắt đầu công việc và xác nhận mức lương theo giờ, giờ làm việc và ngày thanh toán. Hàn Quốc đảm bảo mức lương tối thiểu theo luật pháp, và các ca làm việc thêm giờ, ban đêm hoặc ngày lễ sẽ được nhận phụ cấp bổ sung. Tự lưu giữ cuống lương và nhật ký chuyên cần sẽ giúp ích rất nhiều cho bạn sau này.",
    },
    {
      title: "Nơi ở, Ăn uống và Di chuyển",
      body: "Kiểm tra khi ký hợp đồng xem có được cung cấp nhà ở, ăn uống và phương tiện di chuyển hay không và ai là người chịu chi phí. Nếu chi phí ăn ở bị trừ vào lương, hãy hiểu rõ mức trừ và điều khoản từ trước. Hãy lên kế hoạch cách đi đến công trường và xác minh thời gian di chuyển trước ngày đầu tiên làm việc.",
    },
    {
      title: "Hướng dẫn báo cáo và tư vấn",
      body: "Nếu bạn bị nợ lương hoặc bị thương khi làm việc (tai nạn lao động), bạn có thể nộp báo cáo và nhận hỗ trợ. Những quyền này được đảm bảo bình đẳng cho người lao động nước ngoài. Nếu tự mình giải quyết gặp khó khăn, hãy tìm kiếm sự giúp đỡ từ các đối tác hành chính/lao động của MONO hoặc bàn tư vấn dành cho người nước ngoài.",
    },
    {
      title: "Học tiếng Hàn công trường",
      body: "Học trước các dụng cụ, nhiệm vụ và thuật ngữ an toàn thường dùng sẽ giúp việc giao tiếp dễ dàng hơn nhiều. Bạn có thể kiểm tra các gói thuật ngữ theo từng ngành cụ thể kèm theo bản dịch trong tab 'Thuật ngữ'. Tập trung vào những từ bạn nghe thường xuyên và lịch sự yêu cầu nói chậm lại nếu bạn không hiểu.",
    },
  ],
};

const LANG_DETAILS = [
  { key: "KO", label: "한국어", desc: "한국 현장 적응 가이드" },
  { key: "EN", label: "English", desc: "Korean Field Adaptation Guide" },
  { key: "VI", label: "Tiếng Việt", desc: "Hướng dẫn thích nghi công trường" },
];

export default function ForeignOnboardingGuide() {
  const [lang, setLang] = useState<string>("KO");
  const [open, setOpen] = useState<number | null>(0);

  const guides = GUIDES_LANG[lang] || GUIDES_LANG["KO"];
  const currentLang = LANG_DETAILS.find((l) => l.key === lang) || LANG_DETAILS[0];

  const pillStyle = (active: boolean): CSSProperties => ({
    padding: "8px 16px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    background: active ? C1 : SOFT,
    color: active ? "#fff" : TEXT,
    transition: "all 0.2s ease",
  });

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "4px 0" }}>
      {/* 가이드 헤더 카드 */}
      <div style={card}>
        <div style={langTabContainer} role="tablist" aria-label="언어 선택">
          {LANG_DETAILS.map((l) => (
            <button
              key={l.key}
              type="button"
              role="tab"
              aria-selected={lang === l.key}
              style={pillStyle(lang === l.key)}
              onClick={() => {
                setLang(l.key);
                setOpen(0); // 언어 변경 시 첫 번째 항목 오픈
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
        <h2 style={{ margin: "10px 0 4px", fontSize: 16, fontWeight: 800, color: TEXT, wordBreak: "keep-all" }}>
          {currentLang.desc}
        </h2>
        <p style={{ margin: 0, fontSize: 12.5, color: FAINT, lineHeight: 1.5, wordBreak: "keep-all" }}>
          {lang === "KO" && "처음 한국 현장에서 일하는 기술자를 위한 기본 안내예요. 항목을 눌러 자세히 확인하세요."}
          {lang === "EN" && "Basic guidance for workers working at Korean sites for the first time. Click each item to view details."}
          {lang === "VI" && "Hướng dẫn cơ bản cho người lao động lần đầu làm việc tại công trường Hàn Quốc. Nhấp vào từng mục để xem chi tiết."}
        </p>
      </div>

      {/* 아코디언 리스트 */}
      {guides.map((g, i) => {
        const expanded = open === i;
        return (
          <div key={g.title} style={card}>
            <button
              type="button"
              aria-expanded={expanded}
              aria-label={g.title}
              onClick={() => setOpen(expanded ? null : i)}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 14.5, fontWeight: 800, color: TEXT, wordBreak: "keep-all" }}>{g.title}</span>
              <span style={{ color: FAINT, fontSize: 12, flex: "0 0 auto", transition: "transform 0.2s ease", transform: expanded ? "rotate(180deg)" : "none" }} aria-hidden>
                ▼
              </span>
            </button>
            {expanded && (
              <p style={{ margin: "12px 0 0", fontSize: 13, color: SUB, lineHeight: 1.7, wordBreak: "keep-all", overflowWrap: "break-word" }}>
                {g.body}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
