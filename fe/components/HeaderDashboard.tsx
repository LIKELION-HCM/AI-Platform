"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function HeaderDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-[#EDFFFF] border-b border-gray-200 shadow-md sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-6 h-16 flex items-center justify-between">
        <div
          onClick={() => router.push("/dashboard")}
          className="flex items-center cursor-pointer"
        >
          <Image
            src="/logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <h1 className="text-xl font-bold text-teal-700 tracking-tight">
            Talent Fit
          </h1>
        </div>

        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="cursor-pointer flex items-center gap-3 rounded-full px-2 py-1 hover:bg-gray-100 transition"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">
                  {user.fullName || user.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.userType?.toLowerCase() || "User"}
                </p>
              </div>

              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {getInitials(user.fullName, user.email)}
              </div>

              {/* <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" /> */}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {user.fullName || user.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>

                <div className="border-t border-gray-100" />

                {/* Future actions */}
                {/* 
                <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50">
                  Profile
                </button>
                */}

                <button
                  onClick={logout}
                  className="cursor-pointer w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
