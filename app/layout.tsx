import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/lib/contexts/UserContext";

export const metadata: Metadata = {
  title: "HolyFit - Balance Life | 400여 가지 영양소로 완성하는 진짜 건강",
  description: "의사가 개발한 과학적 영양 솔루션. 400여 가지 미량 영양소 분석과 맞춤형 밸런스밀로 건강한 라이프스타일을 만들어보세요.",
  keywords: "영양 분석, 건강 관리, 밸런스밀, 영양소 균형, 맞춤 식단, 미량영양소",
  openGraph: {
    title: "HolyFit - Balance Life",
    description: "400여 가지 영양소로 완성하는 진짜 건강",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="antialiased font-pretendard">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
