/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import DetailedSectionCard from "@/components/DetailSectionCard";
import DropzoneUpload from "@/components/DropzoneUpload";
import FullPageLoader from "@/components/Loading";
import OverallCard from "@/components/OverallCard";
import ToastContainer from "@/components/ToastContainer";
import { toast } from "@/lib/useToast";
import { FileText } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const onAnalyze = async () => {
    if (!cvFile) {
      toast.warning("Please attach a CV file.");
      return;
    }
    if (!jdFile) {
      toast.warning("Please attach a JD file.");
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.append("cv", cvFile);
    form.append("jd", jdFile);

    try {
      const res = await fetch("/api/scan", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw data;
      setResult(data);

      const overallScore = data.overall?.match_score || data.match_score || 0;
      toast.success(`CV analyzed successfully! Match score: ${overallScore}%`);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.message ||
          "Failed to analyze CV. Please try again. The file may be too large."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-100 relative">
      {loading && <FullPageLoader />}
      <ToastContainer />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CV Scanner
          </h1>
          <p className="text-gray-400 text-sm">
            Upload a CV & JD to analyze matching score using AI
          </p>
        </div>

        {/* File Upload Section */}
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <DropzoneUpload
            onSubmit={setCvFile as any}
            loading={loading}
            file={cvFile}
            label="Upload CV"
            removable
            accentColor="blue"
            onUseSample={() => toast.info("Sample CV feature coming soon!")}
          />
          <DropzoneUpload
            onSubmit={setJdFile as any}
            loading={loading}
            file={jdFile}
            label="Upload JD"
            removable
            accentColor="purple"
            onUseSample={() => toast.info("Sample JD feature coming soon!")}
          />
        </section>

        {/* Analyze Button */}
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="w-full h-14 mb-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl text-lg cursor-pointer flex items-center justify-center"
        >
          {loading ? "Analyzing..." : "Analyze CV & JD"}
        </button>

        {/* Results Section */}
        {result ? (
          <div>
            <h2 className="font-semibold mb-4 text-xl text-gray-200">
              Analysis Result
            </h2>
            <div className="space-y-6">
              {/* Overall Summary */}
              <OverallCard overall={result.overall} />

              {/* Detailed Sections */}
              <DetailedSectionCard
                title="Experience"
                data={result.experience}
              />

              <DetailedSectionCard title="Skills" data={result.skills} />

              <DetailedSectionCard
                title="Position & Title"
                data={result.position_title}
              />

              <DetailedSectionCard title="Education" data={result.education} />

              {/* Keywords */}
              {result.highlighted_keywords &&
                result.highlighted_keywords.length > 0 && (
                  <div className="bg-gray-800/50 rounded-lg shadow-sm p-6 border border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-200 mb-3">
                      Key ATS Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.highlighted_keywords.map(
                        (keyword: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30"
                          >
                            {keyword}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        ) : (
          <div className="p-12 rounded-lg shadow-sm bg-gray-800/50 border border-gray-700 text-center">
            <div className="flex flex-col items-center justify-center">
              <FileText className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-lg text-gray-300 mb-2">No Analysis Yet</p>
              <p className="text-sm text-gray-400">
                Upload a CV + JD and click Analyze to see the matching score
                here.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
