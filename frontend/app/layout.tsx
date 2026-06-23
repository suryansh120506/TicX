import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/ui/Sidebar";
import { TickerProvider } from "../context/TickerContext";
import { ClerkProvider } from '@clerk/nextjs'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TickX // Telemetry",
  description: "Institutional Grade Quantitative Terminal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn("font-sans", geist.variable)}>
        <body className={`${inter.className} bg-[#030405] text-slate-100 antialiased overflow-hidden h-screen flex`}>
          <TickerProvider>
            <Sidebar />
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-y-auto relative custom-scrollbar pt-16 md:pt-0">
              {children}
            </div>
          </TickerProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}