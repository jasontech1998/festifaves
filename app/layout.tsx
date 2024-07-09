import type { Metadata } from "next";
import { Raleway as FontSans } from "next/font/google";
import { SessionProvider } from "@/components/provider";
import { cn } from "@/lib/utils";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "FestiFaves",
  description: "Discover your festival playlist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={cn(
          "min-h-screen font-sans antialiased background-container",
          fontSans.variable
        )}
      >
        <div className="gradient-background"></div>
        <SessionProvider>
          <Header />
          <main className="flex-grow relative">
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
