/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DetailedSectionCard from "@/components/DetailSectionCard";
import OverallCard from "@/components/OverallCard";
import api from "@/lib/axios";
import { cleanJSON } from "@/utils/clean";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BackToDashboard } from "../BackButton";
import FullPageLoader from "../Loading";

export default function CompanyScanDetail() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const scanId = params?.id as string;

  const fetchScanDetail = async (id: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/matchings/${id}`);
      const data = res.data;
      setData(cleanJSON(data.responseBody));
    } catch (error) {
      console.error("Failed to fetch scan detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!scanId) return redirect("/dashboard");

    fetchScanDetail(scanId);
  }, [scanId]);

  const matchedKeywords = data?.highlighted_keywords?.matched ?? [];
  const missingKeywords = data?.highlighted_keywords?.missing ?? [];

  return (
    <div className="p-6 space-y-6">
      {loading && <FullPageLoader text="Loading"/>}
      <BackToDashboard />
      {/* OVERALL with Meta Info */}
      <OverallCard overall={data?.overall} meta={data?.meta} />

      {/* BREAKDOWN SECTIONS */}
      <DetailedSectionCard title="Experience" data={data?.experience} />

      <DetailedSectionCard title="Skills" data={data?.skills} />

      <DetailedSectionCard
        title="Position & Title"
        data={data?.position_title}
      />

      <DetailedSectionCard title="Education" data={data?.education} />

      {/* ATS KEYWORDS */}
      {(matchedKeywords.length > 0 || missingKeywords.length > 0) && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 space-y-4">
          <h3 className="text-lg font-semibold text-gray-100">
            ATS Keywords Analysis
          </h3>

          {/* Matched */}
          {matchedKeywords.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <h4 className="text-sm font-semibold text-gray-200">
                  Matched Keywords ({matchedKeywords.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((k: string, i: number) => (
                  <span
                    key={i}
                    className="
                      px-3 py-1.5 text-xs rounded-full font-medium
                      bg-green-500/15 text-green-400
                      border border-green-500/30
                    "
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing */}
          {missingKeywords.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <h4 className="text-sm font-semibold text-gray-200">
                  Missing Keywords - ATS Risk ({missingKeywords.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((k: string, i: number) => (
                  <span
                    key={i}
                    className="
                      px-3 py-1.5 text-xs rounded-full font-medium
                      bg-red-500/15 text-red-400
                      border border-red-500/30
                    "
                  >
                    {k}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3 italic">
                These keywords appear in the job description but not in the CV.
                Adding them may improve ATS screening results.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
