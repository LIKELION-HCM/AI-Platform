"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface FullPageAnalyzeLoaderProps {
  loading: boolean;
  done: boolean; // BE finished
}

const STEPS = [
  "Reading CV",
  "Reading Job Description",
  "Matching skills reminding",
  "Calculating matching score",
];

export default function ProgressPageLoader({
  loading,
  done,
}: FullPageAnalyzeLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!loading) return;

    const timer = setInterval(() => {
      setProgress((p) => {
        let next = p;

        if (p < 60) next += 2;
        else if (p < 85) next += 0.6;
        else if (p < 95) next += 0.2;

        return Math.min(next, 95);
      });
    }, 120);

    return () => clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    if (progress < 25) setActiveStep(0);
    else if (progress < 45) setActiveStep(1);
    else if (progress < 70) setActiveStep(2);
    else setActiveStep(3);
  }, [progress]);

  useEffect(() => {
    if (!done) return;

    setProgress(100);
    setActiveStep(STEPS.length);
  }, [done]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-[440px] px-6 py-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-800">
            Analyzing CV & JD
          </span>
          <span className="text-sm text-gray-500">{Math.floor(progress)}%</span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-gray-700 mb-4 text-center">
          {progress < 60
            ? "Parsing CV & Job Description"
            : progress < 85
            ? "Analyzing skill matching"
            : progress < 100
            ? "Finalizing matching result"
            : "Completed"}
        </p>

        <div className="space-y-2">
          {STEPS.map((step, index) => {
            const isDone = index < activeStep;
            const isActive = index === activeStep && progress < 100;

            return (
              <div
                key={step}
                className={cn("flex items-center gap-2 text-sm", {
                  "text-green-600": isDone,
                  "text-blue-600": isActive,
                  "text-gray-400": !isDone && !isActive,
                })}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                    {index + 1}
                  </span>
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-400 mt-5 text-center">
          This process may take longer depending on document complexity.
        </p>
      </div>
    </div>
  );
}
