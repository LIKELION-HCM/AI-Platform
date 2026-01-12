/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DetailedSectionCard from "@/components/DetailSectionCard";
import OverallCard from "@/components/OverallCard";
import api from "@/lib/axios";
import { cleanJSON } from "@/utils/clean";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import FullPageLoader from "../Loading";

export default function UserScanDetail() {
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
        <DetailedSectionCard title="Next Steps" data={data?.next_steps} />

        {/* Quick Win Section */}
        {/* {data?.quick_wins && data.quick_wins.length > 0 && (
          <div className="bg-teal-100 rounded-2xl shadow-sm p-6 border-2 border-teal-300">
            <h3 className="text-lg font-bold text-teal-900 mb-4">Quick Win</h3>
            <ul className="space-y-2">
              {data.quick_wins.map((win: string, i: number) => (
                <li
                  key={i}
                  className="text-sm text-gray-800 flex items-start gap-2"
                >
                  <span className="text-teal-700 mt-0.5">•</span>
                  <span>{win}</span>
                </li>
              ))}
            </ul>
          </div>
        )} */}
      </div>
    </div>
  );
}
