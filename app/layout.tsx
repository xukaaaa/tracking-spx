// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NextAuthProvider } from "@/components/auth/NextAuthProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: 'Tracking System',
    description: 'Track your packages easily',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <body className="bg-background text-foreground">
        <NextAuthProvider>
          <ThemeProvider>
              <ScrollArea className="flex-1">
                  {children}
                  <SpeedInsights />
              </ScrollArea>
          </ThemeProvider>
        </NextAuthProvider>
        </body>
        </html>
    );
}