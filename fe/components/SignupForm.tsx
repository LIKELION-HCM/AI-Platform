"use client";

import { useAuthUI } from "@/context/AuthUIContext";
import api from "@/lib/axios";
import { toast } from "@/lib/useToast";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function SignupForm() {
  const { openLogin, openVerifyEmail, closeAuth } = useAuthUI();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignup = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`;
  };

  const validate = () => {
    let valid = true;

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError("Invalid email format");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (!PASSWORD_REGEX.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number"
      );
      valid = false;
    }

    return valid;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError(null);
    setPasswordError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      await api.post("/api/auth/register", { email, password });
      closeAuth();
      openVerifyEmail(email);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Create an account
        </h2>
        <p className="text-sm text-gray-500">Please enter your details.</p>
      </div>

      <button
        onClick={handleGoogleSignup}
        type="button"
        className="w-full mb-5 flex items-center justify-center gap-3 h-12 border-2 border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition cursor-pointer"
      >
        <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
        <span className="text-sm font-medium text-gray-700">
          Sign up with Google
        </span>
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">or</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(null);
            }}
            className="w-full h-11 px-4 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
          />
          {emailError && (
            <p className="mt-1 text-xs text-red-500">{emailError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(null);
              }}
              className="w-full h-11 px-4 pr-11 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {passwordError && (
            <p className="mt-1 text-xs text-red-500">{passwordError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-lg font-semibold bg-[#FFB200] hover:bg-yellow-600 transition cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          onClick={openLogin}
          type="button"
          className="font-semibold text-gray-900 hover:text-gray-700 underline cursor-pointer"
        >
          Login here
        </button>
      </div>
    </>
  );
}
