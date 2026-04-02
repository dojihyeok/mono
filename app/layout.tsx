import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mono | 기술의 가치를 알아보는 세상",
  description: "글로벌 테크니션 매칭 및 커리어 관리 플랫폼. 당신의 현장 경력이 자산이 됩니다.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import BottomNav from "@/components/BottomNav/BottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className={`${inter.className} app-shell`}>
          <main className="app-content">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
