"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ScanResultList from "@/components/ScanResultList";
import ToastContainer from "@/components/ToastContainer";
import api from "@/lib/axios";
import { mapScanItem } from "@/utils/mapCleanItem";

export default function UserDashboard() {
  const [scans, setScans] = useState<any[]>([]);
  const router = useRouter();

  const onSelect = (scan: any) => {
    router.push(`/dashboard/${scan.id}`);
  };

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const res = await api.get("/api/matchings", {
          params: {
            page: 0,
            size: 10,
            sort: [],
          },
        });
        const items = res.data.content?.map(mapScanItem);
        setScans(items);
      } catch (error) {
        console.error("Failed to fetch scans:", error);
      }
    };

    fetchScans();
  }, []);

  return (
    <>
      <ToastContainer />

      <div className="space-y-6 text-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">My CV Match Analysis</h1>
            <p className="text-sm text-gray-400">
              Analyze how well your CV matches different job descriptions
            </p>
          </div>

          <button
            onClick={() => router.push("/scan")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm font-medium shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Analyze New JD
          </button>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-13 px-4 py-3 text-xs font-medium text-gray-400 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10">
            <div className="col-span-5">Summary</div>
            <div className="col-span-2 text-center">Score</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1"></div>
          </div>

          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 220px)" }}
          >
            <ScanResultList items={scans} onSelect={onSelect} mode="user" />

            {scans.length === 0 && (
              <div className="p-6 text-sm text-gray-500 text-center">
                No analysis yet. Click <b>Analyze New JD</b> to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
