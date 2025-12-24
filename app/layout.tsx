import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider"
import { SidebarProvider } from "@/components/ui/sidebar";
import QueryProvider from "@/components/providers/QueryProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EBuy",
  description: "EBuy - Your Ultimate Online Shopping Destination",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>

        
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
      <ThemeProvider attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
                <ClerkProvider>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as React.CSSProperties
            }
          >
            <QueryProvider>
              {children}
            </QueryProvider>
          </SidebarProvider>
        </ClerkProvider>
      </ThemeProvider>
            </body>
    </html>
  );
}
