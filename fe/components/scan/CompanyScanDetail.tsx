/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DetailedSectionCard from "@/components/DetailSectionCard";
import OverallCard from "@/components/OverallCard";
import api from "@/lib/axios";
import { cleanJSON } from "@/utils/clean";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import FullPageLoader from "../Loading";

export default function CompanyScanDetail() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const scanId = params?.id as string;

  const fetchScanDetail = async (id: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/matchings/${id}`);
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
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {loading && <FullPageLoader text="Loading" />}

        <OverallCard overall={data?.overall} meta={data?.meta} />

        <div className="grid md:grid-cols-2 gap-6">
          <DetailedSectionCard title="Experiences" data={data?.experience} />
          <DetailedSectionCard title="Skills" data={data?.skills} />
          <DetailedSectionCard
            title="Position & Title"
            data={data?.position_title}
          />
          <DetailedSectionCard title="Education" data={data?.education} />
        </div>

        {(matchedKeywords.length > 0 || missingKeywords.length > 0) && (
          <div className="rounded-xl p-6 border-2 border-[#5ACFD6]">
            <div className="bg-[#B4F1F1] rounded-xl p-[10px] mb-6">
              <h3 className="text-xl font-bold text-center text-[#176D81]">
                ATS Keywords Analysis
              </h3>
            </div>

            {matchedKeywords.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    Matched Keywords ({matchedKeywords.length})
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchedKeywords.map((k: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 text-xs rounded-full font-medium bg-green-50 text-green-700 border border-green-200"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {missingKeywords.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    Missing Keywords - ATS Risk ({missingKeywords.length})
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map((k: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 text-xs rounded-full font-medium bg-red-50 text-red-700 border border-red-200"
                    >
                      {k}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3 italic">
                  💡 These keywords appear in the job description but not in the
                  CV. Adding them may improve ATS screening results.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
