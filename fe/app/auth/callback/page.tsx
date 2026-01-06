import { Suspense } from "react";
import AuthCallbackClient from "./AuthCallbackClient";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackLoading />}>
      <AuthCallbackClient />
    </Suspense>
  );
}

function CallbackLoading() {
  return (
    <div className="flex items-center justify-center h-screen text-gray-400">
      Signing you in...
    </div>
  );
}
