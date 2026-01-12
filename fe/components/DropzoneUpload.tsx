"use client";

import { FileText, Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

export default function DropzoneUpload({
  onSubmit,
  files = [],
  label,
  removable = false,
  maxFiles = 1,
  loading = false,
}: any) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length) {
        setError("Only PDF / DOC / DOCX files are allowed");
        return;
      }

      const next = [...files, ...accepted].slice(0, maxFiles);
      onSubmit(next);
      setError(null);
    },
    [files, maxFiles, onSubmit]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: maxFiles > 1,
    disabled: loading || files.length >= maxFiles,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  const handleRemove = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    onSubmit(files.filter((_: any, idx: number) => idx !== index));
  };

  return (
    <div className="space-y-3">
      {/* FILE LIST */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f: File, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-[#5ACFD6]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-5 h-5 text-teal-600" />
                <span className="text-sm font-medium text-gray-700 truncate">
                  {f.name}
                </span>
              </div>

              {removable && (
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, i)}
                  className="cursor-pointer p-1 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* DROPZONE */}
      {files.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 transition text-center cursor-pointer
            ${
              isDragActive
                ? "border-[#5ACFD6] bg-[#EDFFFF]"
                : "border-[#5ACFD6] hover:bg-[#EDFFFF]/50"
            }
            ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
          `}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#B4F1F180] flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-teal-600" />
            </div>

            <span className="px-5 py-2 rounded-lg bg-[#B4F1F180] text-sm font-medium text-teal-700 mb-2">
              {label}
            </span>

            <p className="text-xs text-gray-500">
              Drag & drop here, or click to select
              {maxFiles > 1 && ` (max ${maxFiles})`}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              PDF, DOC, or DOCX up to 10MB
            </p>
          </div>
        </div>
      )}

      {maxFiles > 1 && files.length > 0 && (
        <p className="text-xs text-gray-500 text-center">
          {files.length} of {maxFiles} file(s) uploaded
        </p>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
