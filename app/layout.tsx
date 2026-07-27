import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-ibm-plex-sans-thai",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ดุสิตสวรรค์ธัญมหาปราสาท | Dusitsawan Tunyamahaprasat",
  description: "ระบบจัดการและสรุปข้อมูลกีฬาสี คณะ 2 สีชมพู (ดุสิตสวรรค์) - นวัตกรรมเพื่อการบริหารจัดการข้อมูลการแข่งขันอย่างมืออาชีพ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${ibmPlexSansThai.variable} ${inter.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-text-primary">
        <Navbar />
        <main className="flex-grow pt-20 md:pt-24 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
