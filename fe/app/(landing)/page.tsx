"use client";

import { useAuth } from "@/context/AuthContext";
import { WandSparkles } from "lucide-react";
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
    <>
      <section className="relative overflow-hidden min-h-[calc(100vh-64px)] bg-[#EDFFFF] flex items-center justify-center px-6 py-20">
        {/* 🔵 Blur top-right */}
        <div className="absolute right-[-187px] -top-[187px] w-[504px] h-[504px] rounded-full bg-[#5ACFD6] blur-[100px]" />

        {/* 🔵 Blur bottom-left */}
        <div className="absolute left-[-187px] -bottom-[187px] w-[504px] h-[504px] rounded-full bg-[#5ACFD6] blur-[100px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
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

      {/* <footer className="relative bg-[#EDFFFF] border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Resume Fit. All rights reserved.
        </div>
      </footer> */}
    </>
  );
}
