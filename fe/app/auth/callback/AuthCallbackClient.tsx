"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import RoleSelectModal from "@/components/RoleSelectModal";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/useToast";

export default function AuthCallbackClient() {
  const router = useRouter();
  const params = useSearchParams();
  const { login, user } = useAuth();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = params.get("accessToken");

    if (!accessToken) {
      toast.error("Login failed");
      router.replace("/");
      return;
    }

    login(accessToken)
      .then(() => {
        if (user?.registrationStatus === "NEW") {
          setShowRoleModal(true);
          return;
        }

        toast.success("Login successful");
        router.replace("/dashboard");
      })
      .catch(() => {
        toast.error("Authentication failed");
        router.replace("/");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params, router, login, user]);

  const handleRoleDone = () => {
    router.replace("/dashboard");
  };

  if (loading) return null;

  return <RoleSelectModal open={showRoleModal} onDone={handleRoleDone} />;
}
