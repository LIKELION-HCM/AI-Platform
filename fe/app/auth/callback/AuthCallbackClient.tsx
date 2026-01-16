"use client";

import RoleSelectModal from "@/components/RoleSelectModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthCallbackClient() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading, setTokenAndFetchUser } = useAuth();

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [tokenHandled, setTokenHandled] = useState(false);

  useEffect(() => {
    const accessToken = params.get("accessToken");
    if (!accessToken || tokenHandled) return;

    setTokenHandled(true);
    setTokenAndFetchUser(accessToken);
  }, [params, setTokenAndFetchUser, tokenHandled]);

  useEffect(() => {
    if (loading || !user) return;

    if (user.registrationStatus === "NEW") {
      setRoleModalOpen(true);
    } else {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <RoleSelectModal
      open={roleModalOpen}
      onDone={() => router.replace("/dashboard")}
    />
  );
}
