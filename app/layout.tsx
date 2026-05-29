import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/context/AuthContext";
import { UIProvider } from "@/context/UIContext";
import SplashScreen from "@/components/UI/SplashScreen";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mono | 기술의 가치를 알아보는 세상",
  description: "글로벌 테크니션 매칭 및 커리어 관리 플랫폼. 당신의 현장 경력이 자산이 됩니다.",
  manifest: "/manifest.json",
  themeColor: "#06070a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MONO",
  },
  icons: {
    icon: "/apple-touch-icon.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('mono-theme');
                  if (theme) {
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <div className={inter.className}>
          <AuthProvider>
            <UIProvider>
              <SplashScreen />
              <AppShell>
                {children}
              </AppShell>
            </UIProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
