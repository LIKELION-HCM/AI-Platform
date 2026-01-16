"use client";

import CompanyScanDetail from "@/components/scan/CompanyScanDetail";
import UserScanDetail from "@/components/scan/UserScanDetail";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ScanDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user) return null;

  if (user.registrationStatus === "NEW") {
    return null;
  }

  switch (user.userType) {
    case "COMPANY":
      return <CompanyScanDetail />;

    case "USER":
      return <UserScanDetail />;

    default:
      return null;
  }
}
