import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function BackToDashboard() {
  return (
    <Link
      href="/dashboard"
      className="
        inline-flex items-center gap-2
        text-sm font-medium
        text-gray-400 hover:text-gray-200
        transition
      "
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Dashboard
    </Link>
  );
}
