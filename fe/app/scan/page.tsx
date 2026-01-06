"use client";

import DropzoneUpload from "@/components/DropzoneUpload";
import HeaderDashboard from "@/components/HeaderDashboard";
import ProgressPageLoader from "@/components/LoadingProgress";
import ToastContainer from "@/components/ToastContainer";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/apiClient";
import api from "@/lib/axios";
import { toast } from "@/lib/useToast";
import { buildCvTextFromForm } from "@/utils/buildCvText";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CvMode = "upload" | "form";
type JdMode = "upload" | "text";

type CvForm = {
  fullName: string;
  yearOfBirth: string;
  education: string;
  experience: string;
  softSkills: string;
  certificates: string;
  others: string;
};

const initialCvForm: CvForm = {
  fullName: "",
  yearOfBirth: "",
  education: "",
  experience: "",
  softSkills: "",
  certificates: "",
  others: "",
};

export default function ScanPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [cvMode, setCvMode] = useState<CvMode>("upload");
  const [jdMode, setJdMode] = useState<JdMode>("upload");

  const [cvs, setCvs] = useState<File[]>([]);
  const [jds, setJds] = useState<File[]>([]);

  const [cvForm, setCvForm] = useState<CvForm>(initialCvForm);
  const [jdText, setJdText] = useState("");

  const [loading, setLoading] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  const isUsingCvFile = cvMode === "upload";
  const isUsingJdFile = jdMode === "upload";
  const isCompany = user?.userType === "COMPANY";

  const maxCV = isCompany ? 5 : 1;
  const maxJD = isCompany ? 1 : 5;

  const toggleCvMode = () => {
    setCvMode((m) => (m === "upload" ? "form" : "upload"));
    setCvs([]);
    setCvForm(initialCvForm);
  };

  const toggleJdMode = () => {
    setJdMode((m) => (m === "upload" ? "text" : "upload"));
    setJds([]);
    setJdText("");
  };

  const isCvValid = isUsingCvFile ? cvs.length > 0 : !!cvForm.fullName;
  const isJdValid = isUsingJdFile ? jds.length > 0 : !!jdText.trim();
  const canSubmit = isCvValid && isJdValid && !loading;

  const onAnalyze = async () => {
    if (!isCvValid) {
      toast.warning("Please upload CV or fill candidate information");
      return;
    }

    if (!isJdValid) {
      toast.warning("Please upload JD or input JD text");
      return;
    }

    const form = new FormData();

    // CV
    if (isUsingCvFile) {
      cvs.forEach((f) => form.append("cvs", f));
    } else {
      form.append("cvText", buildCvTextFromForm(cvForm));
    }

    // JD
    if (isUsingJdFile) {
      jds.forEach((f) => form.append("jds", f));
    } else {
      form.append("jdText", jdText);
    }

    form.append("userType", "COMPANY");

    try {
      setLoading(true);
      setAnalysisDone(false);

      const res = await apiClient.post("/scan", form);
      if (res.status !== 200) {
        toast.error("Analyze failed");
        return;
      }

      const results = res.data?.results;

      if (!Array.isArray(results) || results.length === 0) {
        toast.error("No matching result returned");
        return;
      }

      const payload = results.map((item: any) => ({
        candidateName: item.meta?.candidate_name || item.cvName || "Unknown",
        jdPosition: item.meta?.job_title || item.jdName || "Unknown",
        cvId: "",
        jdId: "",
        cvSummary: item.meta?.one_line_summary || "",
        matchingTime: new Date().toISOString(),
        matchingScore: item.overall?.match_score || 0,
        responseBody: item,
      }));

      const saveRes = await api.post("/api/matchings", payload);

      if (saveRes.status !== 200 || !Array.isArray(saveRes.data)) {
        toast.error("Save matching result failed");
        return;
      }

      setAnalysisDone(true);

      toast.success(`Analyzed ${payload.length} matching(s)`);

      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    } catch (e) {
      toast.error("Analyze failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderDashboard />
      <ToastContainer />
      {loading && <ProgressPageLoader loading={loading} done={analysisDone} />}
      <div className="min-h-screen mx-auto px-6 py-10 space-y-6 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
        <h1 className="text-2xl font-semibold text-white">CV & JD Matching</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <SectionHeader
              title="Candidate (CV)"
              mode={cvMode}
              onToggle={toggleCvMode}
              uploadLabel="Switch to Upload CV"
              altLabel="Switch to Fill manually"
            />

            {cvMode === "upload" ? (
              <DropzoneUpload
                label="Upload CV"
                files={cvs}
                onSubmit={setCvs}
                removable
                maxFiles={maxCV}
                loading={loading}
              />
            ) : (
              <CvStructuredForm value={cvForm} onChange={setCvForm} />
            )}
          </section>

          <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <SectionHeader
              title="Job Description"
              mode={jdMode}
              onToggle={toggleJdMode}
              uploadLabel="Switch to Upload JD"
              altLabel="Switch to Paste text"
            />

            {jdMode === "upload" ? (
              <DropzoneUpload
                label="Upload Job Description"
                files={jds}
                onSubmit={setJds}
                removable
                maxFiles={maxJD}
                loading={loading}
              />
            ) : (
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste job description here..."
                className="w-full min-h-[260px] bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-200"
              />
            )}
          </section>
        </div>

        <div className="flex justify-end">
          <button
            disabled={!canSubmit}
            onClick={onAnalyze}
            className={`
             px-6 py-2 rounded-lg text-sm font-medium
            ${
              canSubmit
                ? "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }
          `}
          >
            {loading ? "Analyzing..." : "Start Matching"}
          </button>
        </div>
      </div>
    </>
  );
}

function SectionHeader({
  title,
  mode,
  onToggle,
  uploadLabel,
  altLabel,
}: {
  title: string;
  mode: "upload" | "form" | "text";
  onToggle: () => void;
  uploadLabel: string;
  altLabel: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-semibold text-gray-100">{title}</h2>
      <button
        onClick={onToggle}
        className="cursor-pointer text-xs px-3 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-gray-300 hover:text-white"
      >
        {mode === "upload" ? altLabel : uploadLabel}
      </button>
    </div>
  );
}

function FileUpload({
  files,
  onChange,
}: {
  files: File[];
  onChange: (f: File[]) => void;
}) {
  return (
    <div className="border border-dashed border-gray-700 rounded-lg p-4 space-y-3">
      <input
        type="file"
        multiple
        onChange={(e) =>
          onChange(e.target.files ? Array.from(e.target.files) : [])
        }
        className="block w-full text-sm text-gray-400 cursor-pointer"
      />

      {files.length > 0 && (
        <ul className="text-sm text-gray-300 space-y-1">
          {files.map((f, i) => (
            <li key={i} className="truncate">
              {f.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CvStructuredForm({
  value,
  onChange,
}: {
  value: CvForm;
  onChange: (v: CvForm) => void;
}) {
  const update = (key: keyof CvForm, val: string) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="space-y-3">
      <Input
        label="Full name"
        value={value.fullName}
        onChange={(v: any) => update("fullName", v)}
      />
      <Input
        label="Birth year"
        value={value.yearOfBirth}
        onChange={(v: any) => update("yearOfBirth", v)}
      />
      <Textarea
        label="Education"
        value={value.education}
        onChange={(v: any) => update("education", v)}
      />
      <Textarea
        label="Work experience"
        value={value.experience}
        onChange={(v: any) => update("experience", v)}
      />
      <Textarea
        label="Soft skills"
        value={value.softSkills}
        onChange={(v: any) => update("softSkills", v)}
      />
      <Textarea
        label="Certificates"
        value={value.certificates}
        onChange={(v: any) => update("certificates", v)}
      />
      <Textarea
        label="Others"
        value={value.others}
        onChange={(v: any) => update("others", v)}
      />
    </div>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[80px] bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200"
      />
    </div>
  );
}
