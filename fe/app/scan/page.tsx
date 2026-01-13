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
  firstName: string;
  lastName: string;
  yearOfBirth: string;
  education: string;
  jobSkills: string;
  softSkills: string;
  experience: string;
  yearOfExperience: string;
  certificates: string;
};

type CvErrors = Partial<Record<keyof CvForm, string>>;

const REQUIRED_CV_FIELDS: (keyof CvForm)[] = [
  "firstName",
  "lastName",
  "yearOfBirth",
  "education",
  "jobSkills",
  "softSkills",
  "yearOfExperience",
  "experience",
];

const initialCvForm: CvForm = {
  firstName: "",
  lastName: "",
  yearOfBirth: "",
  education: "",
  jobSkills: "",
  softSkills: "",
  experience: "",
  yearOfExperience: "",
  certificates: "",
};

export default function ScanPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [cvMode, setCvMode] = useState<CvMode>("upload");
  const [jdMode, setJdMode] = useState<JdMode>("upload");

  const [cvs, setCvs] = useState<File[]>([]);
  const [jds, setJds] = useState<File[]>([]);

  const [cvForm, setCvForm] = useState<CvForm>(initialCvForm);
  const [cvErrors, setCvErrors] = useState<CvErrors>({});

  const [jdText, setJdText] = useState("");

  const [loading, setLoading] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  const isCompany = user?.userType === "COMPANY";

  const maxCV = isCompany ? 5 : 1;
  const maxJD = isCompany ? 1 : 5;

  const requestsLeft = 3; // TODO: Get from API
  const totalRequests = 3;

  const toggleCvMode = () => {
    setCvMode((m) => (m === "upload" ? "form" : "upload"));
    setCvs([]);
    setCvForm(initialCvForm);
    setCvErrors({});
  };

  const toggleJdMode = () => {
    setJdMode((m) => (m === "upload" ? "text" : "upload"));
    setJds([]);
    setJdText("");
  };

  const isCvValid =
    cvMode === "upload"
      ? cvs.length > 0
      : REQUIRED_CV_FIELDS.every((k) => cvForm[k].trim());

  const isJdValid = jdMode === "upload" ? jds.length > 0 : !!jdText.trim();
  const canSubmit = isCvValid && isJdValid && !loading;

  const onAnalyze = async () => {
    setCvErrors({});

    if (cvMode === "form") {
      const errors = validateCvForm(cvForm);
      if (Object.keys(errors).length > 0) {
        setCvErrors(errors);
        toast.error("Please fix validation errors");
        return;
      }
    }

    if (!isJdValid || !isCvValid) {
      toast.warning("Please provide CV and JD data");
      return;
    }

    const form = new FormData();

    if (cvMode === "upload") {
      cvs.forEach((f) => form.append("cvs", f));
    } else {
      form.append("cvText", buildCvTextFromForm(cvForm));
    }

    if (jdMode === "upload") {
      jds.forEach((f) => form.append("jds", f));
    } else {
      form.append("jdText", jdText);
    }

    form.append("userType", user?.userType || "USER");

    try {
      setLoading(true);
      setAnalysisDone(false);

      const res = await apiClient.post("/scan", form);
      const results = res.data?.results;

      const payload = results.map((item: any) => ({
        candidateName: item.meta?.candidate_name || "Unknown",
        jdPosition: item.meta?.job_title || "Unknown",
        cvId: "",
        jdId: "",
        cvSummary: item.meta?.one_line_summary || "",
        matchingTime: new Date().toISOString(),
        matchingScore: item.overall?.match_score || 0,
        responseBody: item,
      }));

      await api.post("/api/matchings", payload);

      setAnalysisDone(true);
      toast.success(`Analyzed ${payload.length} matching(s)`);
      setTimeout(() => router.push("/dashboard"), 2500);
    } catch {
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

      <div className="px-8 py-10 bg-[#EDFFFF] space-y-8">
        <div className="max-w-8xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-[#176D81]">
                AI CV-JD Analysis
              </h1>
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                {requestsLeft}/{totalRequests} requests left today
              </span>
            </div>

            <button
              disabled={!canSubmit}
              onClick={onAnalyze}
              className={`px-6 py-3 rounded-lg font-semibold transition shadow-lg ${
                canSubmit
                  ? "bg-[#FFB200] hover:bg-yellow-600 text-white cursor-pointer"
                  : "bg-[#969696] text-[#D9D9D9] cursor-not-allowed"
              }`}
            >
              {loading ? "Analyzing..." : "Analyze CV–JD"}
            </button>
          </div>

          <p className="text-gray-600 -mt-4">
            Upload a candidate CV and a job description to evaluate the
            compatibility.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">UPLOAD CV</h2>
              <button
                onClick={toggleCvMode}
                className="cursor-pointer text-sm px-4 py-2 rounded-lg border-2 border-[#5ACFD6] hover:bg-[#EDFFFF]/50 transition font-medium"
              >
                {cvMode === "upload"
                  ? "Switch to Fill Manually"
                  : "Switch to Upload Files"}
              </button>
            </div>

            {cvMode === "upload" ? (
              <DropzoneUpload
                label="UPLOAD CV"
                files={cvs}
                onSubmit={setCvs}
                maxFiles={maxCV}
                removable
                loading={loading}
              />
            ) : (
              <CvStructuredForm
                value={cvForm}
                errors={cvErrors}
                onChange={(v) => {
                  setCvForm(v);
                  setCvErrors({});
                }}
              />
            )}
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">UPLOAD JD</h2>
              <button
                onClick={toggleJdMode}
                className="cursor-pointer text-sm px-4 py-2 rounded-lg border-2 border-[#5ACFD6] hover:bg-[#EDFFFF]/50 transition font-medium"
              >
                {jdMode === "upload"
                  ? "Switch to Paste Text"
                  : "Switch to Upload Files"}
              </button>
            </div>

            {jdMode === "upload" ? (
              <DropzoneUpload
                label="UPLOAD JD"
                files={jds}
                onSubmit={setJds}
                maxFiles={maxJD}
                removable
                loading={loading}
              />
            ) : (
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste your job description here..."
                className="w-full min-h-[400px] p-4 rounded-xl border-2 border-[#D2D0CE] focus:border-[#5ACFD6] focus:outline-none text-sm text-gray-700 resize-none bg-[#FAFAFA]"
              />
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function CvStructuredForm({
  value,
  errors,
  onChange,
}: {
  value: CvForm;
  errors: CvErrors;
  onChange: (v: CvForm) => void;
}) {
  const update = (k: keyof CvForm, v: string) => onChange({ ...value, [k]: v });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={value.firstName}
          placeholder="Nguyen"
          onChange={(v: string) => update("firstName", v)}
          error={errors.firstName}
        />
        <Input
          label="Last Name"
          value={value.lastName}
          placeholder="Van A"
          onChange={(v: string) => update("lastName", v)}
          error={errors.lastName}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Year of Birth"
          value={value.yearOfBirth}
          placeholder="Ex: 2000"
          onChange={(v: string) => update("yearOfBirth", v)}
          error={errors.yearOfBirth}
        />
        <Input
          label="Education"
          value={value.education}
          placeholder="Ex: Bachelor of Science"
          onChange={(v: string) => update("education", v)}
          error={errors.education}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Job Skills"
          value={value.jobSkills}
          placeholder="Ex: JavaScript, Python, etc."
          onChange={(v: string) => update("jobSkills", v)}
          error={errors.jobSkills}
        />
        <Input
          label="Soft Skills"
          value={value.softSkills}
          placeholder="Ex: Communication, Teamwork, etc."
          onChange={(v: string) => update("softSkills", v)}
          error={errors.softSkills}
        />
      </div>

      <Textarea
        label="Experiences"
        value={value.experience}
        placeholder="Describe your experience here..."
        onChange={(v: string) => update("experience", v)}
        error={errors.experience}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Year of Experience"
          value={value.yearOfExperience}
          placeholder="Ex: 2 years"
          onChange={(v: string) => update("yearOfExperience", v)}
          error={errors.yearOfExperience}
        />
        <Input
          label="Certificates (optional)"
          value={value.certificates}
          placeholder="Ex: Ielts, Toeic, etc."
          onChange={(v: string) => update("certificates", v)}
        />
      </div>
    </div>
  );
}

function Input({ label, value, placeholder, onChange, error }: any) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 rounded-lg border-2 transition focus:outline-none text-sm bg-[#FAFAFA] ${
          error
            ? "border-red-300 focus:border-red-400"
            : "border-[#D2D0CE] focus:border-[#5ACFD6]"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function Textarea({ label, value, placeholder, onChange, error }: any) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full min-h-[100px] px-3 py-2 rounded-lg border-2 transition focus:outline-none text-sm resize-none bg-[#FAFAFA] ${
          error
            ? "border-red-300 focus:border-red-400"
            : "border-[#D2D0CE] focus:border-[#5ACFD6]"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function isValidBirthYear(year: string) {
  const y = Number(year);
  return Number.isInteger(y) && y >= 1950 && y <= new Date().getFullYear();
}

function validateCvForm(form: CvForm): CvErrors {
  const errors: CvErrors = {};

  if (!form.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!form.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!form.yearOfBirth.trim()) {
    errors.yearOfBirth = "Year of birth is required";
  } else if (!isValidBirthYear(form.yearOfBirth)) {
    errors.yearOfBirth = "Invalid year (1950-current)";
  }

  if (!form.education.trim()) {
    errors.education = "Education is required";
  }

  if (!form.jobSkills.trim()) {
    errors.jobSkills = "Job skills are required";
  }

  if (!form.softSkills.trim()) {
    errors.softSkills = "Soft skills are required";
  }

  if (!form.experience.trim()) {
    errors.experience = "Work experience is required";
  }

  if (!form.yearOfExperience.trim()) {
    errors.yearOfExperience = "Years of experience is required";
  }

  return errors;
}
