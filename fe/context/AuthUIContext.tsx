"use client";

import { createContext, useContext, useState } from "react";

type AuthMode = "login" | "signup";

type AuthUIContextType = {
  authOpen: boolean;
  authMode: AuthMode;
  openLogin: () => void;
  openSignup: () => void;
  closeAuth: () => void;
};

const AuthUIContext = createContext<AuthUIContextType | null>(null);

export function AuthUIProvider({ children }: { children: React.ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  return (
    <AuthUIContext.Provider
      value={{
        authOpen,
        authMode,
        openLogin: () => {
          setAuthMode("login");
          setAuthOpen(true);
        },
        openSignup: () => {
          setAuthMode("signup");
          setAuthOpen(true);
        },
        closeAuth: () => setAuthOpen(false),
      }}
    >
      {children}
    </AuthUIContext.Provider>
  );
}

export const useAuthUI = () => {
  const ctx = useContext(AuthUIContext);
  if (!ctx) throw new Error("useAuthUI must be used inside AuthUIProvider");
  return ctx;
};
