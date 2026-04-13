import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "designviewer — DESIGN.md Browser",
  description:
    "Browse, compare, and customize DESIGN.md design systems from getdesign.md",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#ededed]">
        <header className="flex items-center justify-between px-4 sm:px-6 lg:px-12 py-4 border-b border-[#1a1a1a]">
          <a
            href="/"
            className="text-[20px] font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Design Viewer
          </a>
          <div className="flex items-center gap-4" style={{ fontFamily: "var(--font-mono)" }}>
            <a
              href="https://getdesign.md/what-is-design-md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-[#a0a0a0] hover:text-[#ededed] transition-colors duration-150"
            >
              What is DESIGN.md?
            </a>
            <a
              href="/about"
              className="text-[13px] text-[#a0a0a0] hover:text-[#ededed] transition-colors duration-150"
            >
              About
            </a>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
