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

  return (
    <div className="bg-gray-800/50 rounded-lg shadow-sm p-6 border border-gray-700">
      <h3 className="text-lg font-bold mb-4 text-gray-100 flex items-center gap-2">
        {title}
      </h3>

      <div className="flex items-start gap-6 mb-6">
        <div className="flex-shrink-0">
          <CircularProgress score={data.match_score} size={100} />
        </div>

        <div className="flex-1 space-y-4">
          {/* Matched Points */}
          {data.matched_points && data.matched_points.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <h4 className="text-sm font-semibold text-gray-200">
                  Strengths
                </h4>
              </div>
              <ul className="space-y-1.5 ml-6">
                {data.matched_points.map((point: string, i: number) => (
                  <li
                    key={i}
                    className="text-sm text-gray-300 flex items-start gap-2"
                  >
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Matched Skills (for skills section) */}
          {data.matched_skills && data.matched_skills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <h4 className="text-sm font-semibold text-gray-200">
                  Matched Skills
                </h4>
              </div>
              <div className="flex flex-wrap gap-2 ml-6">
                {data.matched_skills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Points */}
          {data.missing_points && data.missing_points.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <h4 className="text-sm font-semibold text-gray-200">Gaps</h4>
              </div>
              <ul className="space-y-1.5 ml-6">
                {data.missing_points.map((point: string, i: number) => (
                  <li
                    key={i}
                    className="text-sm text-gray-300 flex items-start gap-2"
                  >
                    <span className="text-red-400 mt-0.5">✗</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Skills (for skills section) */}
          {data.missing_skills && data.missing_skills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <h4 className="text-sm font-semibold text-gray-200">
                  Missing Skills
                </h4>
              </div>
              <div className="flex flex-wrap gap-2 ml-6">
                {data.missing_skills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggestions */}
      {data.suggestions && data.suggestions.length > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-orange-400" />
            <h4 className="text-sm font-semibold text-gray-200">
              Recommendations
            </h4>
          </div>
          <ul className="space-y-2">
            {data.suggestions.map((suggestion: string, i: number) => (
              <li
                key={i}
                className="text-sm text-gray-300 flex items-start gap-2"
              >
                <span className="text-orange-400 font-medium">{i + 1}.</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
