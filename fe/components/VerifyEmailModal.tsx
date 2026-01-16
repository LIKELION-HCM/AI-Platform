"use client";

import { useAuthUI } from "@/context/AuthUIContext";

export default function VerifyEmailModal({ email }: { email?: string }) {
  const { closeAuth } = useAuthUI();

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Verify your email</h2>

      <p className="text-sm text-gray-600">
        We’ve sent a verification link to
        <br />
        <b>{email}</b>
      </p>

      <p className="text-xs text-gray-500">
        Please check your inbox and spam folder.
      </p>

      <button
        onClick={closeAuth}
        className="mt-4 w-full h-11 rounded-lg bg-[#FFB200] text-white font-semibold hover:bg-yellow-600 transition cursor-pointer"
      >
        Got it
      </button>
    </div>
  );
}
