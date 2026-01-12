import CircularProgress from "./CircularProgress";

export default function OverallCard({
  overall,
  meta,
}: {
  overall: any;
  meta?: any;
}) {
  if (!overall) return null;

  return (
    <div>
      {/* Header with Candidate Info */}
      {meta && (
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-teal-900 mb-2">
                {meta.candidate_name || "Candidate"}
              </h1>
              <p className="text-sm text-gray-600 mb-3">
                This overview summarizes how well the candidate's CV matches the
                job requirements. The match score reflects overall compatibility
              </p>
            </div>
            <div>
              <span className="inline-block px-4 py-2 text-sm font-semibold rounded-lg bg-[#C5FFB9] text-[#025513]">
                {overall.verdict || "Excellent Match"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Assessment Section */}
      <div className="rounded-xl border-2 border-[#5ACFD6] p-6 mb-6">
        <h2 className="rounded-xl text-2xl font-bold text-center text-[#176D81] mb-6 p-[10px] bg-[#B4F1F1]">
          Overall Assessment
        </h2>

        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <CircularProgress score={overall.match_score} size={140} />
          </div>

          <div className="flex-1 space-y-4">
            {(overall.summary || overall.encouragement) && (
              <p className="text-gray-700 leading-relaxed">{overall.summary || overall.encouragement}</p>
            )}
            {/* Strength */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">Strength</h3>
              <ul className="space-y-1.5 text-sm text-gray-700">
                {overall.strengths?.map((strength: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-600 mt-0.5">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                Weaknesses
              </h3>
              <ul className="space-y-1.5 text-sm text-gray-700">
                {overall.weaknesses?.map((weakness: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-gray-500 mt-0.5">•</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
