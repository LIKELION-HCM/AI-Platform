"use client";

export default function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
        <div className="animate-spin w-6 h-6 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
        <span className="text-lg font-medium text-gray-800">
          Processing...
        </span>
      </div>
    </div>
  );
}
