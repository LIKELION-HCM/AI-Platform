"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ToastContainer from "@/components/ToastContainer";
import api from "@/lib/axios";
import { formatDate } from "@/lib/dayjs";
import { mapScanItem } from "@/utils/mapCleanItem";
import TableSkeleton from "../TableSkeleton";

export default function CompanyDashboard() {
  const [scans, setScans] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchScans = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/matchings", {
          params: {
            page: currentPage - 1,
            size: 10,
            sort: [],
          },
        });

        const items = res.data.content?.map(mapScanItem) || [];
        setScans(items);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch scans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, [currentPage]);

  return (
    <>
      <ToastContainer />

      <div className="mx-auto px-4">
        <div className="max-w-8xl mx-auto space-y-6">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[#176D81] mb-2">
                Candidate Dashboard
              </h1>
              <p className="text-gray-600">
                Review CV–JD matching results and manage your analysis history.
              </p>
            </div>

            <button
              onClick={() => router.push("/scan")}
              className="px-6 py-3 rounded-lg bg-[#FFB200] hover:bg-yellow-600 text-white font-semibold shadow-lg hover:shadow-xl transition cursor-pointer"
            >
              + Analyze CV-JD
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* ===== TABLE HEADER ===== */}
            <div className="overflow-x-auto">
              <table className="w-full table-fixed border-collapse">
                <TableCols />
                <thead className="bg-[#5ACFD6] text-gray-900 text-sm font-semibold">
                  <tr>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Summary</th>
                    <th className="px-6 py-4 text-left">Role</th>
                    <th className="px-6 py-4 text-center">Match Score</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
              </table>
            </div>

            {/* ===== SCROLLABLE BODY ===== */}
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 333px)" }}
            >
              <table className="w-full table-fixed border-collapse">
                <TableCols />
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <TableSkeleton rows={6} />
                  ) : scans.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-16 text-center text-gray-500"
                      >
                        No analysis yet. Click Analyze CV-JD to get started
                      </td>
                    </tr>
                  ) : (
                    scans.map((scan) => {
                      const score = scan.data?.overall?.match_score ?? 0;
                      const candidateName =
                        scan.data?.meta?.candidate_name || "Unknown";
                      const summary =
                        scan.data?.meta?.one_line_summary ||
                        "No summary available";
                      const role =
                        scan.data?.meta?.job_title || scan.jdName || "—";

                      return (
                        <tr
                          key={scan.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {formatDate(scan.createdAt, "DD/MM/YY")}
                          </td>

                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900 text-sm mb-1">
                              {candidateName}
                            </p>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {summary}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-700 truncate">
                            {role}
                          </td>

                          <td className="px-6 py-4 text-center">
                            <span className="inline-block px-4 py-1.5 rounded-md text-sm font-bold bg-[#B4F1F1] text-gray-900">
                              {score}%
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() =>
                                router.push(`/dashboard/${scan.id}`)
                              }
                              className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 underline"
                            >
                              View Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {scans.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer text-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer text-gray-700"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function TableCols() {
  return (
    <colgroup>
      <col style={{ width: "120px" }} />
      <col style={{ width: "calc(100% - 620px)" }}/>
      <col style={{ width: "240px" }} />
      <col style={{ width: "140px" }} />
      <col style={{ width: "120px" }} />
    </colgroup>
  );
}
