import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Inter, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-play-fair",
  subsets: ["latin"]
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
})

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Ibudo360",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${inter.variable} ${nunito.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster closeButton />
      </body>
    </html>
  );
}
