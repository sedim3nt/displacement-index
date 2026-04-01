import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Displacement Index — Personal AI Job Risk Assessment",
  description: "Measure your personal AI displacement risk. The Displacement Risk Index (DRI) tracks 50+ occupations and delivers a personalized risk report.",
  keywords: ["AI displacement", "job risk", "automation", "DRI", "future of work"],
  openGraph: {
    title: "Displacement Index",
    description: "What's your AI displacement risk?",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Nav />
        <main style={{ paddingTop: 64 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
