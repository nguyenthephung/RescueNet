import type { Metadata } from "next";
import "@/styles/globals.css";
import { ReduxProvider } from "@/store/ReduxProvider";

export const metadata: Metadata = {
  title: "RescueNet - Professional Next.js Application",
  description: "Built with Next.js 15, React, TypeScript, and TailwindCSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
