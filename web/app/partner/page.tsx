import { PartnerClient } from "./PartnerClient";

export const metadata = {
  title: "MONO Partner Workspace — 협력업체를 위한 프로젝트 운영 SaaS",
  description:
    "프로젝트 관리, 인력 운영, 출역 관리, 문서 관리까지 하나의 Workspace에서. 협력업체를 위한 프로젝트 운영 SaaS, MONO Partner Workspace를 무료로 시작하세요.",
  openGraph: {
    title: "MONO Partner Workspace",
    description: "협력업체를 위한 프로젝트 운영 Workspace. 프로젝트·인력·출역·문서 관리를 하나로.",
    type: "website",
    images: [{ url: "/images/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MONO Partner Workspace",
    description: "협력업체를 위한 프로젝트 운영 Workspace. 프로젝트·인력·출역·문서 관리를 하나로.",
    images: ["/images/logo.png"],
  },
  robots: { index: false, follow: false },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MONO Partner Workspace",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "협력업체를 위한 프로젝트 운영 Workspace. 프로젝트·인력·출역·문서 관리를 하나의 서비스에서 제공합니다.",
  offers: [
    { "@type": "Offer", name: "Starter", price: "0", priceCurrency: "KRW" },
    { "@type": "Offer", name: "Business", priceCurrency: "KRW" },
    { "@type": "Offer", name: "Enterprise", priceCurrency: "KRW" },
  ],
};

export default function PartnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PartnerClient />
    </>
  );
}
