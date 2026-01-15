import { AuthProvider } from "@/context/AuthContext";
import { AuthUIProvider } from "@/context/AuthUIContext";
import "@/lib/dayjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Talent Fit - AI-Powered CV and JD Matching",
  description:
    "Upload your CV and Job Description to instantly see match score, gaps, and improvement insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <AuthUIProvider>{children}</AuthUIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
