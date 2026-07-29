import type { Metadata } from "next";
import { Geist_Mono, Nunito, Figtree } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import ServiceWorkerRegister from "@/components/Providers/ServiceWorkerRegister";

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "BP Diary",
  description: "Track your blood pressure and heart rate, log readings manually or from images, and view trends over time to monitor your health."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", nunito.variable, geistMono.variable, "font-sans", figtree.variable)}
    >

      <body className="h-screen flex flex-col relative">
        <AuthProvider>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>

            <Navbar />

            <section className="mt-4 wrapper flex flex-1 flex-col">
              {/* <ServiceWorkerRegister /> */}
              {children}
            </section>
          </ThemeProvider>
        </AuthProvider>
      </body>
      <script async src="https://docs.opencv.org/4.x/opencv.js"></script>
    </html>
  );
}
