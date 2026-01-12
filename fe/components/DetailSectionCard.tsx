/* eslint-disable @typescript-eslint/no-explicit-any */

import { CheckCircle, Lightbulb, XCircle } from "lucide-react";
import CircularProgress from "./CircularProgress";

export default function DetailedSectionCard({
  title,
  data,
}: {
  title: string;
  data: any;
}) {
  if (!data) return null;

  /* Detect NEXT STEPS section */
  const isNextSteps = (value: any) => {
    return (
      value &&
      typeof value === "object" &&
      (Array.isArray(value.quick_wins) ||
        Array.isArray(value.rewrite_experience_examples) ||
        Array.isArray(value.medium_term) ||
        Array.isArray(value.long_term))
    );
  };

  if (isNextSteps(data)) {
    const renderList = (label: string, items?: string[]) => {
      if (!items || items.length === 0) return null;

      return (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            {label}
          </h4>
          <ul className="ml-6 space-y-1 list-disc text-sm text-gray-700">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      );
    };

    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 space-y-5">
        <h3 className="text-lg font-bold text-blue-900">{title}</h3>

        {renderList("Quick wins", data.quick_wins)}
        {renderList(
          "Rewrite experience examples",
          data.rewrite_experience_examples
        )}
        {renderList("Medium term", data.medium_term)}
        {renderList("Long term", data.long_term)}
      </div>
    );
  }

  return (
    <div className="rounded-xl p-6 border-2 border-[#5ACFD6]">
      <div className="bg-[#B4F1F1] rounded-xl p-[10px] mb-6">
        <h3 className="text-xl font-bold text-center text-[#176D81]">
          {title}
        </h3>
      </div>

      <div className="flex items-start gap-6 mb-6">
        {/* SCORE */}
        {typeof data.match_score === "number" && (
          <div className="flex-shrink-0">
            <CircularProgress score={data.match_score} size={120} />
          </div>
        )}

        <div className="flex-1 space-y-4">
          {/* Strengths / Matched points */}
          {Array.isArray(data.matched_points) &&
            data.matched_points.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <h4 className="text-sm font-bold text-gray-900">Strength</h4>
                </div>
                <ul className="space-y-1.5 ml-6">
                  {data.matched_points.map((point: string, i: number) => (
                    <li
                      key={i}
                      className="text-sm text-gray-700 flex items-start gap-2"
                    >
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Matched Skills */}
          {Array.isArray(data.matched_skills) &&
            data.matched_skills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <h4 className="text-sm font-bold text-gray-900">Strength</h4>
                </div>
                <div className="flex flex-wrap gap-2 ml-6">
                  {data.matched_skills.map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Gaps / Missing points - Weaknesses */}
          {Array.isArray(data.missing_points) &&
            data.missing_points.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-gray-500" />
                  <h4 className="text-sm font-bold text-gray-900">
                    Weaknesses
                  </h4>
                </div>
                <ul className="space-y-1.5 ml-6">
                  {data.missing_points.map((point: string, i: number) => (
                    <li
                      key={i}
                      className="text-sm text-gray-700 flex items-start gap-2"
                    >
                      <span className="text-gray-500 mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Missing Skills */}
          {Array.isArray(data.missing_skills) &&
            data.missing_skills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-gray-500" />
                  <h4 className="text-sm font-bold text-gray-900">
                    Weaknesses
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2 ml-6">
                  {data.missing_skills.map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded border border-gray-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Recommendations */}
      {Array.isArray(data.improvement_suggestions) &&
        data.improvement_suggestions.length > 0 && (
          <div className="bg-[#FFB20040] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-orange-600" />
              <h4 className="text-sm font-bold text-gray-900">
                Recommendations
              </h4>
            </div>
            <ul className="space-y-2">
              {data.improvement_suggestions.map(
                (suggestion: string, i: number) => (
                  <li
                    key={i}
                    className="text-sm text-gray-700 flex items-start gap-2"
                  >
                    <span className="text-orange-600 font-medium">
                      {i + 1}.
                    </span>
                    <span>{suggestion}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
    </div>
  );
}
