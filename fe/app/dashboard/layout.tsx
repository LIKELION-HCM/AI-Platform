"use client";

import AppGuard from "@/components/AppGuard";
import HeaderDashboard from "@/components/HeaderDashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppGuard>
      <HeaderDashboard />
      <main className="p-6 min-h-[calc(100vh-65px)] bg-[#EDFFFF] text-gray-100 relative">
        {children}
      </main>
    </AppGuard>
  );
}
