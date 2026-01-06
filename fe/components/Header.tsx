"use client";

import { useAuth } from "@/context/AuthContext";
import { FileText, LogIn, UserPlus } from "lucide-react";

interface HeaderProps {
  onLogin?: () => void;
  onSignup?: () => void;
}

export default function Header({ onLogin, onSignup }: HeaderProps) {
  const { user } = useAuth();

  return (
   <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-md">
      <div className="max-w-8xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-[#197083] tracking-tight">
            RESUME FIT
          </h1>
        </div>

        {!user && (
          <div className="flex items-center gap-3">
            {onSignup && (
              <button
                onClick={onSignup}
                className="px-5 py-2 text-sm font-bold text-gray-700 bg-[#B4F1F1] rounded-full hover:bg-teal-200 transition cursor-pointer"
              >
                Sign up
              </button>
            )}

            {onLogin && (
              <button
                onClick={onLogin}
                className="px-5 py-2 text-sm font-bold text-white bg-[#FFB200] rounded-full hover:bg-yellow-400 transition cursor-pointer"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
