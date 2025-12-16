/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { FileText } from "lucide-react";

export default function ResultsCard({ result }: { result: any }) {
  if (!result) {
    return (
      <div className="p-6 rounded-lg shadow-sm bg-gray-800/50 border border-gray-700 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <FileText className="w-12 h-12 text-gray-600 mb-3" />
          <p className="text-sm text-gray-400">
            Upload a CV + JD and click Analyze to see the matching score here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-sm bg-gradient-to-br from-gray-800 to-gray-800/50 border border-gray-700">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">
            {result.match_score}%
          </h3>
          <p className="text-xs text-gray-400 mt-1">Match Score</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            result.match_score >= 80
              ? "bg-green-500/20 text-green-400"
              : result.match_score >= 60
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {result.match_score >= 80
            ? "Excellent"
            : result.match_score >= 60
            ? "Good"
            : "Needs Work"}
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-300 leading-relaxed">
        {result.summary}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
          <h4 className="font-semibold text-green-400 mb-2 text-sm">
            Strengths
          </h4>
          <ul className="space-y-1">
            {result.strengths?.map((s: string, i: number) => (
              <li
                key={i}
                className="text-xs text-gray-300 flex items-start gap-2"
              >
                <span className="text-green-400 mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
          <h4 className="font-semibold text-red-400 mb-2 text-sm">
            Weak Points
          </h4>
          <ul className="space-y-1">
            {result.weak_points?.map((w: string, i: number) => (
              <li
                key={i}
                className="text-xs text-gray-300 flex items-start gap-2"
              >
                <span className="text-red-400 mt-0.5">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
        <h4 className="font-semibold text-blue-400 mb-2 text-sm">
          Recommendations
        </h4>
        <ol className="space-y-1">
          {result.recommendations?.map((r: string, i: number) => (
            <li
              key={i}
              className="text-xs text-gray-300 flex items-start gap-2"
            >
              <span className="text-blue-400 font-medium">{i + 1}.</span>
              <span>{r}</span>
            </li>
          ))}
        </ol>
      </div>

      {result.highlighted_keywords && (
        <div className="mt-4 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Keywords: {result.highlighted_keywords?.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
