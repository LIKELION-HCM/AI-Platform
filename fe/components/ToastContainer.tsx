"use client";

import {
  generateToastId,
  registerToastCallback,
  unregisterToastCallback,
} from "@/lib/useToast";
import { Toast, ToastType } from "@/types/toast";
import { useEffect, useState } from "react";
import ToastItem from "./ToastItem";

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const addToast = (message: string, type: ToastType) => {
      const newToast: Toast = {
        id: generateToastId(),
        message,
        type,
      };
      setToasts((prev) => [...prev, newToast]);
    };

    registerToastCallback(addToast);

    return () => {
      unregisterToastCallback();
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-6 right-6 z-999999 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
}
