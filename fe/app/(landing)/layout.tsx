"use client";

import AuthModal from "@/components/AuthModal";
import Header from "@/components/Header";
import { useAuthUI } from "@/context/AuthUIContext";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { openLogin, openSignup } = useAuthUI();

  return (
    <div className="min-h-screen text-gray-100">
      {/* Header */}
      <Header onLogin={openLogin} onSignup={openSignup} />

      {/* Main content */}
      <main className="relative">{children}</main>

      {/* Footer */}
      <footer className="bg-[#F7F3F3] border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Resume Fit. All rights reserved.
        </div>
      </footer>

      <AuthModal />
    </div>
  );
}
