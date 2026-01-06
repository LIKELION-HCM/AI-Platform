"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeaderDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-6 h-16 flex items-center justify-between">
        <div 
          onClick={() => router.push("/dashboard")} 
          className="flex items-center cursor-pointer"
        >
          <h1 className="text-xl font-bold text-teal-700 tracking-tight">
            RESUME FIT
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">
                  {user.fullName || user.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.userType?.toLowerCase() || "User"}
                </p>
              </div>
              
              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {getInitials(user.fullName, user.email)}
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}