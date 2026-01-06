"use client";

import { useAuthUI } from "@/context/AuthUIContext";
import { toast } from "@/lib/useToast";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function LoginForm() {
  const { openSignup } = useAuthUI();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: call login API
      // await api.post("/auth/login", { email, password });
      toast.success("Logged in successfully");
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
        <p className="text-sm text-gray-500">Please enter your details.</p>
      </div>

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full mb-5 flex items-center justify-center gap-3 h-12 border-2 border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition cursor-pointer"
      >
        <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
        <span className="text-sm font-medium text-gray-700">
          Login with Google
        </span>
      </button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">or</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-11 px-4 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 px-4 pr-11 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-lg font-semibold bg-[#FFB200] hover:bg-yellow-600 transition cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Switch to Signup */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={openSignup}
          type="button"
          className="font-semibold text-gray-900 hover:text-gray-700 underline cursor-pointer"
        >
          Login Here
        </button>
      </div>
    </>
  );
}
