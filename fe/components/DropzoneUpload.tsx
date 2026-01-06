"use client";

import { FileText, X } from "lucide-react";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

interface DropzoneUploadProps {
  onSubmit: (files: File[]) => void;
  loading?: boolean;
  files?: File[];
  label?: string;
  removable?: boolean;
  accentColor?: "blue" | "purple";
  maxFiles?: number;
}

export default function DropzoneUpload({
  onSubmit,
  loading = false,
  files = [],
  label = "Upload file",
  removable = false,
  accentColor = "blue",
  maxFiles = 1,
}: DropzoneUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const mimeAccept = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length) {
        setError("Only PDF / DOC / DOCX files are allowed");
        return;
      }

      const nextFiles = [...files, ...acceptedFiles].slice(0, maxFiles);

      if (nextFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      onSubmit(nextFiles);
      setError(null);
    },
    [files, maxFiles, onSubmit]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: mimeAccept,
    multiple: maxFiles > 1,
    disabled: loading || files.length >= maxFiles,
  });

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    onSubmit(next);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-5 rounded-lg cursor-pointer ${
          isDragActive ? "border-blue-500" : "border-gray-700"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />

        <p className="text-sm font-semibold mb-2 text-gray-100">{label}</p>

        {files.length === 0 && (
          <p className="text-xs text-gray-400">
            Drag & drop or click to upload ({maxFiles} max)
          </p>
        )}

        {files.map((f, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-sm text-gray-300 mt-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-gray-400 shrink-0" />

              <span
                className="text-sm text-gray-200 truncate max-w-[360px]"
                title={f.name}
              >
                {f.name}
              </span>
            </div>
            {removable && (
              <button onClick={() => removeFile(i)}>
                <X className="w-4 h-4 text-red-400" />
              </button>
            )}
          </div>
        ))}

        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      </div>
    </div>
  );
}
