import CircularProgress from "./CircularProgress";

export default function OverallCard({ overall }: { overall: any }) {
  if (!overall) return null;

  return (
    <div className="bg-gray-800/50 rounded-lg shadow-sm p-6 border border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-gray-100">
        Overall Assessment
      </h2>

      <div className="flex flex-col md:flex-row items-start gap-8 mb-6">
        <div className="flex-shrink-0">
          <CircularProgress score={overall.match_score} />
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <div
              className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2"
              style={{
                backgroundColor:
                  overall.match_score >= 80
                    ? "rgba(34, 197, 94, 0.2)"
                    : overall.match_score >= 70
                    ? "rgba(234, 179, 8, 0.2)"
                    : overall.match_score >= 50
                    ? "rgba(249, 115, 22, 0.2)"
                    : "rgba(239, 68, 68, 0.2)",
                color:
                  overall.match_score >= 80
                    ? "#4ade80"
                    : overall.match_score >= 70
                    ? "#facc15"
                    : overall.match_score >= 50
                    ? "#fb923c"
                    : "#f87171",
              }}
            >
              {overall.verdict || "Overall Rating"}
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed">{overall.summary}</p>

          {overall.key_highlights && overall.key_highlights.length > 0 && (
            <div className="pt-3 border-t border-gray-700">
              <h4 className="text-sm font-semibold text-gray-200 mb-2">
                Key Highlights:
              </h4>
              <ul className="space-y-1.5">
                {overall.key_highlights.map((highlight: string, i: number) => (
                  <li
                    key={i}
                    className="text-sm text-gray-300 flex items-start gap-2"
                  >
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
