import { AuthProvider } from "@/context/AuthContext";
import { AuthUIProvider } from "@/context/AuthUIContext";
import "@/lib/dayjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0XV4L412MF"
          strategy="afterInteractive"
        />

        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0XV4L412MF');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <AuthUIProvider>{children}</AuthUIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
