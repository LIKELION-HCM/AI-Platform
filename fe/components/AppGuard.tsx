// components/AppGuard.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useDesktopOnly } from "@/lib/useDesktopOnly";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function AppGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const isDesktop = useDesktopOnly();
  const router = useRouter();

  useEffect(() => {
    if (loading || isDesktop === null) return;

    if (!user) {
      router.replace("/");
      return;
    }

    if (!isDesktop) {
      router.replace("/?desktopOnly=true");
      return;
    }
  }, [user, loading, isDesktop, router]);

  if (loading || isDesktop === null) return null;
  if (!user || !isDesktop) return null;

  return <>{children}</>;
}
