"use client"; // Error boundaries must be Client Components

import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from "next/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Food Price Inflation",
    default: "Food Price Inflation",
  },
  icons: {
    icon: "/next.svg",
  },
};

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex h-svh flex-col items-center justify-center">
            <Card>
              <CardHeader>
                <CardTitle>Something went wrong!</CardTitle>
                <CardDescription>{error.message}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full" onClick={() => router.refresh()}>
                  Try again!
                </Button>
              </CardFooter>
            </Card>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
