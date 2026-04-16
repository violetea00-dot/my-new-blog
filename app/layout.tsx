import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: {
    default: "devlog",
    template: "%s | devlog",
  },
  description: "개발과 배움을 기록하는 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
            {children}
          </main>
          <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} devlog. Built with Next.js.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
