import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

// Tajawal font — AGENTS.md design rules: "ALL fonts → Tajawal"
const TajawalFont = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smart Commerce AI",
  description:
    "Centralize inventory, orders, and AI-assisted customer conversation for your business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${TajawalFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface text-on-surface">
        {children}
      </body>
    </html>
  );
}
