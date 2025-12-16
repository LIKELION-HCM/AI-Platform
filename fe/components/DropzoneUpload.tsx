"use client";

import { FileText, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

interface DropzoneUploadProps {
  onSubmit: (file: File | null) => void;
  loading?: boolean;
  file?: File | null;
  label?: string;
  removable?: boolean;
  accentColor?: "blue" | "purple";
  onUseSample?: () => void;
}

export default function DropzoneUpload({
  onSubmit,
  loading = false,
  file,
  label = "Upload file",
  removable = false,
  accentColor = "blue",
  onUseSample,
}: DropzoneUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    file ? file.name : null
  );
  const [error, setError] = useState<string | null>(null);

  const bgColor =
    accentColor === "blue" ? "bg-blue-900/20" : "bg-purple-900/20";
  const borderColorActive =
    accentColor === "blue" ? "border-blue-500" : "border-purple-500";
  const textColor =
    accentColor === "blue" ? "text-blue-400" : "text-purple-400";

  const mimeAccept = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const invalidFiles = fileRejections
          .map((fr) => fr.file.name)
          .join(", ");
        setError(
          `Invalid file format for: ${invalidFiles}. Only PDF/DOC/DOCX allowed.`
        );
        return;
      }
      if (acceptedFiles.length > 0) {
        const f = acceptedFiles[0];
        onSubmit(f);
        setPreview(f.name);
        setError(null);
      }
    },
    [onSubmit]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: mimeAccept,
    disabled: loading,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSubmit(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-5 rounded-lg cursor-pointer transition-all ${
          isDragActive ? borderColorActive : "border-gray-700"
        } ${bgColor} hover:border-gray-600 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded ${
              accentColor === "blue" ? "bg-blue-500/10" : "bg-purple-500/10"
            }`}
          >
            {preview ? (
              <FileText className={`w-5 h-5 ${textColor}`} />
            ) : (
              <Upload className={`w-5 h-5 ${textColor}`} />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-200 mb-1">{label}</p>
            {preview ? (
              <p className="text-sm text-gray-300 font-medium">{preview}</p>
            ) : (
              <p className="text-xs text-gray-400">
                Drag & drop file here, or click to select
              </p>
            )}
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
            {loading && (
              <p className="text-xs text-gray-500 mt-2">
                Uploading / Processing...
              </p>
            )}
          </div>
          {removable && preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-red-400 text-xs font-medium hover:text-red-300 transition-colors"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      {onUseSample && !preview && (
        <button
          onClick={onUseSample}
          className={`mt-2 text-xs ${textColor} hover:underline cursor-pointer transition-colors`}
        >
          Use sample {label.toLowerCase()}
        </button>
      )}
    </div>
  );
}
