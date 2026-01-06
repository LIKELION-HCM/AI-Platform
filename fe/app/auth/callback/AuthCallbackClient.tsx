"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import RoleSelectModal from "@/components/RoleSelectModal";
import { useAuth } from "@/context/AuthContext";
import { setAccessToken } from "@/lib/auth";
import api from "@/lib/axios";
import { toast } from "@/lib/useToast";

export default function AuthCallbackClient() {
  const router = useRouter();
  const params = useSearchParams();
  const { setUser, user } = useAuth();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = params.get("accessToken");

    if (!accessToken) {
      toast.error("Login failed: missing access token");
      router.replace("/");
      return;
    }

    setAccessToken(accessToken);

    api
      .get("/api/me")
      .then((res) => {
        const me = res.data;
        setUser(me);

        if (me.registrationStatus === "NEW") {
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
  }, [params, router, setUser]);

  const handleRoleDone = () => {
    if (!user?.userType) {
      router.replace("/");
      return;
    }
    router.replace("/dashboard");
  };

  if (loading) return null;

  return <RoleSelectModal open={showRoleModal} onDone={handleRoleDone} />;
}
