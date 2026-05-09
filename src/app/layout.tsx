import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import { Inter } from "next/font/google";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "HackaDeck",
  description: "Hatch a limited-edition hackathon Builder Familiar card.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5efe3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
