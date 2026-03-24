import type { Metadata } from "next";
import { Inter, Libre_Caslon_Text, Federo, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const federo = Federo({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-logo",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Massage in Alanya | Larisa — Clinical Manual Therapy",
  description:
    "Professional Pain Relief & Functional Body Restoration in Alanya. Clinical Manual Therapy, Applied Kinesiology, and Osteopathic Techniques.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        inter.variable,
        libreCaslon.variable,
        federo.variable,
        geistMono.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
