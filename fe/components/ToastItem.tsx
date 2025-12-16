import { Toast } from "@/types/toast";
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: number) => void;
}

export default function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "bg-green-500/10 border-green-500/50",
          icon: <CheckCircle className="w-5 h-5 text-green-400" />,
          text: "text-green-400",
        };
      case "error":
        return {
          bg: "bg-red-500/10 border-red-500/50",
          icon: <XCircle className="w-5 h-5 text-red-400" />,
          text: "text-red-400",
        };
      case "warning":
        return {
          bg: "bg-yellow-500/10 border-yellow-500/50",
          icon: <AlertCircle className="w-5 h-5 text-yellow-400" />,
          text: "text-yellow-400",
        };
      case "info":
        return {
          bg: "bg-blue-500/10 border-blue-500/50",
          icon: <Info className="w-5 h-5 text-blue-400" />,
          text: "text-blue-400",
        };
    }
  };

  const styles = getToastStyles();

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg transition-all duration-300 ${
        styles.bg
      } ${
        isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
      }`}
      style={{ minWidth: "320px", maxWidth: "420px" }}
    >
      <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
      <p className={`flex-1 text-sm ${styles.text} leading-relaxed`}>
        {toast.message}
      </p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-300 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
