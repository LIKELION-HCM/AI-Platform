"use client";

import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { toast } from "@/lib/useToast";
import { Check, FileSearch, User } from "lucide-react";
import { useEffect, useState } from "react";
import ToastContainer from "./ToastContainer";

type Role = "company" | "user";

export default function RoleSelectModal({
  open,
  onDone,
}: {
  open: boolean;
  onDone: () => void;
}) {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

  useEffect(() => {
    if (!open) {
      setRole(null);
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const onConfirm = async () => {
    if (!role || loading) return;

    setLoading(true);
    try {
      await api.post("/api/onboarding/choose-type", {
        userType: role === "company" ? "COMPANY" : "USER",
      });

      await refreshUser();
      toast.success("Signup successful");

      setTimeout(() => {
        onDone();
      }, 1500);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-blue-100" />

        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Choose your role
            </h2>
            <p className="text-sm text-gray-500">
              This helps us personalize your experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <button
              disabled={loading}
              onClick={() => setRole("company")}
              className={`relative cursor-pointer p-8 rounded-2xl border-2 transition-all text-center ${
                role === "company"
                  ? "border-teal-400 bg-teal-50 shadow-lg scale-105"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
              } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {/* Checkmark */}
              {role === "company" && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center shadow-md">
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
              )}

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    role === "company" ? "bg-teal-100" : "bg-gray-100"
                  }`}
                >
                  <FileSearch
                    className={`w-8 h-8 ${
                      role === "company" ? "text-teal-600" : "text-gray-600"
                    }`}
                  />
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                HR / RECRUITER
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Scan and evaluate
                <br />
                candidates faster
              </p>
            </button>

            <button
              disabled={loading}
              onClick={() => setRole("user")}
              className={`relative cursor-pointer p-8 rounded-2xl border-2 transition-all text-center ${
                role === "user"
                  ? "border-teal-400 bg-teal-50 shadow-lg scale-105"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
              } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {role === "user" && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center shadow-md">
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
              )}

              <div className="flex justify-center mb-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    role === "user" ? "bg-teal-100" : "bg-gray-100"
                  }`}
                >
                  <User
                    className={`w-8 h-8 ${
                      role === "user" ? "text-teal-600" : "text-gray-600"
                    }`}
                  />
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                CANDIDATE
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Check how your
                <br />
                CV matches a job
              </p>
            </button>
          </div>

          <button
            disabled={!role || loading}
            onClick={onConfirm}
            className={`w-full h-14 rounded-full font-semibold text-base transition-all ${
              role
                ? "bg-[#FFB200] text-white hover:bg-yellow-600 shadow-lg hover:shadow-xl cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
    </>
  );
}
