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

      <AuthModal />
    </div>
  );
}
