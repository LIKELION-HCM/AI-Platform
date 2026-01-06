"use client";

import HeaderDashboard from "@/components/HeaderDashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderDashboard />
      <main className="p-6 min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-100 relative">{children}</main>
    </>
  );
}
