import { AuthProvider } from "@/context/AuthContext";
import { AuthUIProvider } from "@/context/AuthUIContext";
import "@/lib/dayjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Resume Fit - AI-Powered CV-JD Matching",
  description: "Upload your CV and Job Description to instantly see match score, gaps, and improvement insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <AuthUIProvider>{children}</AuthUIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
