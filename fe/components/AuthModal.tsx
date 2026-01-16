import { useAuthUI } from "@/context/AuthUIContext";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import VerifyEmailModal from "./VerifyEmailModal";

export default function AuthModal() {
  const { authOpen, authMode, verifyEmail, closeAuth } = useAuthUI();

  if (!authOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={closeAuth}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 z-10">
        <button
          onClick={closeAuth}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {authMode === "login" && <LoginForm />}
        {authMode === "signup" && <SignupForm />}
        {authMode === "verify-email" && (
          <VerifyEmailModal email={verifyEmail} />
        )}
      </div>
    </div>
  );
}
