import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

/*
 * Font: Tajawal for all text
 * Ref: AGENTS.md §6 "ALL fonts → Tajawal"
 * Loaded via next/font for optimal performance (DESIGN_SYSTEM.md §8.2)
 * Covers Arabic + Latin subsets for Libya market
 */
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
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${TajawalFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground font-body">
        {children}
      </body>
    </html>
  );
}
