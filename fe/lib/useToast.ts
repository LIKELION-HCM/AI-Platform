import { ToastType } from "@/types/toast";

let toastId = 0;
let addToastCallback: ((message: string, type: ToastType) => void) | null = null;

export const registerToastCallback = (
  callback: (message: string, type: ToastType) => void
) => {
  addToastCallback = callback;
};

export const unregisterToastCallback = () => {
  addToastCallback = null;
};

export const toast = {
  success: (message: string) => addToastCallback?.(message, "success"),
  error: (message: string) => addToastCallback?.(message, "error"),
  warning: (message: string) => addToastCallback?.(message, "warning"),
  info: (message: string) => addToastCallback?.(message, "info"),
};

export const generateToastId = () => toastId++;