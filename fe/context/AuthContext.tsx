"use client";

import api from "@/lib/axios";
import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  email: string;
  userType: "COMPANY" | "USER";
  registrationStatus: "NEW" | "COMPLETED";
  fullName: string;
  emailVerified: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<User | null>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await api.get<User>("/me");
      setUser(res.data);
      return res.data;
    } catch {
      setUser(null);
      return null;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    refreshUser()
      .catch(() => {
        localStorage.clear();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
