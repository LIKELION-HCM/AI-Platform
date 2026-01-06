"use client";

import CompanyDashboard from "@/components/dashboard/CompanyDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;

  if (!user) {
    router.replace("/");
    return null;
  }

  if (user.registrationStatus === "NEW") {
    return null;
  }

  switch (user.userType) {
    case "COMPANY":
      return <CompanyDashboard />;

    case "USER":
      return <UserDashboard />;

    default:
      return null;
  }
}
