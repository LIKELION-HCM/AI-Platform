"use client";

import { formatDate } from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Eye } from "lucide-react";

interface ScanItem {
  id: string | number;
  createdAt: string;
  cvName: string;
  jdName: string;
  data: {
    meta?: {
      candidate_name?: string | null;
      job_title?: string | null;
      seniority_level?: "Junior" | "Mid" | "Senior" | "Lead" | null;
      one_line_summary?: string;
    };
    overall?: {
      match_score?: number;
      verdict?: "Excellent Match" | "Good Match" | "Fair Match" | "Poor Match";
    };
  };
}

export default function ScanResultList({
  items,
  onSelect,
  mode = "company",
}: {
  items: ScanItem[];
  onSelect: (item: ScanItem) => void;
  mode?: "company" | "user";
}) {
  return (
    <div className="divide-y divide-gray-800">
      {items.map((item) => {
        const score = item.data?.overall?.match_score ?? 0;

        const title =
          mode === "company"
            ? item.data?.meta?.candidate_name ?? item.cvName
            : item.data?.meta?.job_title ?? item.jdName;

        const subtitle =
          mode === "company"
            ? `Applied for: ${item.jdName}`
            : "Your CV vs this Job";

        const position = item.data?.meta?.job_title ?? item.jdName ?? "—";

        return (
          <div
            key={item.id}
            className="grid grid-cols-13 px-4 py-4 text-sm transition hover:bg-gray-800/60"
          >
            {/* Candidate */}
            <div className="col-span-5 flex flex-col min-w-0">
              <span className="font-medium text-gray-100 truncate">
                {title ?? "—"}
              </span>

              {mode !== "company" && (
                <span className="text-xs text-gray-500 truncate">
                  {subtitle}
                </span>
              )}
              <div className="mt-1 text-sm text-gray-400 leading-snug break-words">
                {item.data?.meta?.one_line_summary?.trim() ||
                  "No summary available"}
              </div>
            </div>

            {/* Match Score */}
            <div className="col-span-2 flex items-center justify-center">
              <ScoreBadge score={score} />
            </div>

            {/* Position */}
            <div className="col-span-3 text-gray-300 leading-snug break-words">
              {position}
            </div>

            {/* Created At */}
            <div className="col-span-2 text-gray-400 text-sm">
              {formatDate(item.createdAt, "DD MMM YYYY HH:mm")}
            </div>

            {/* Actions */}
            <div className="col-span-1 flex items-center justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(item);
                }}
                className="cursor-pointer p-2 rounded-md text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition"
                title="View details"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================= UI helpers ================= */

function ScoreBadge({ score }: { score: number }) {
  let color =
    score >= 85
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : score >= 70
      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
      : score >= 50
      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      : "bg-red-500/20 text-red-400 border-red-500/30";

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-semibold border",
        color
      )}
    >
      {score}%
    </span>
  );
}
