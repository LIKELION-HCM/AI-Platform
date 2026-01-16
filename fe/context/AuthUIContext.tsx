"use client";

import { createContext, useContext, useState } from "react";

type AuthMode = "login" | "signup" | "verify-email";

type AuthUIContextType = {
  authOpen: boolean;
  authMode: AuthMode;
  verifyEmail?: string;
  openLogin: () => void;
  openSignup: () => void;
  openVerifyEmail: (email: string) => void;
  closeAuth: () => void;
};

const AuthUIContext = createContext<AuthUIContextType | null>(null);

export function AuthUIProvider({ children }: { children: React.ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [verifyEmail, setVerifyEmail] = useState<string | undefined>(undefined);

  return (
    <AuthUIContext.Provider
      value={{
        authOpen,
        authMode,
        verifyEmail,
        openLogin: () => {
          setAuthMode("login");
          setAuthOpen(true);
        },
        openSignup: () => {
          setAuthMode("signup");
          setAuthOpen(true);
        },
        openVerifyEmail: (email: string) => {
          setVerifyEmail(email);
          setAuthMode("verify-email");
          setAuthOpen(true);
        },
        closeAuth: () => {
          setAuthOpen(false);
          setVerifyEmail(undefined);
        },
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
