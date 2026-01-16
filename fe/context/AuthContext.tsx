"use client";

import api from "@/lib/axios";
import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  email: string;
  userType: "COMPANY" | "USER";
  registrationStatus: "NEW" | "COMPLETED";
  fullName: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setTokenAndFetchUser: (token: string) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    const res = await api.get<User>("/api/me");
    setUser(res.data);
  };

  const refreshUser = async () => {
    const res = await api.get<User>("/api/me");
    setUser(res.data);
  };

  const setTokenAndFetchUser = (token: string) => {
    localStorage.setItem("access_token", token);
    fetchMe().finally(() => setLoading(false));
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    window.location.href = "/";
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetchMe()
      .catch(logout)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, setTokenAndFetchUser, refreshUser, logout }}
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
