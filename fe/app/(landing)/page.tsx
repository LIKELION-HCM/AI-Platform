"use client";

import RoleSelectModal from "@/components/RoleSelectModal";
import { useAuth } from "@/context/AuthContext";
import { WandSparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) return null;

  return (
    <section className="min-h-[calc(100vh-116px)] bg-[#F7F3F3] flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 mb-10 shadow-sm">
          AI-Powered CV-JD Matching
          <WandSparkles className="w-4 h-4 text-gray-600" />
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-[#176D81] mb-6 leading-tight">
          Resume Fit in <span className="text-[#F7AA00] italic">Seconds</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Upload your CV and Job Description to instantly see
          <br />
          match score, gaps, and improvement insights
        </p>
      </div>
    </section>
  );
}
