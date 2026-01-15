"use client";

import { useEffect, useState } from "react";

const MOBILE_REGEX =
  /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

export function useDesktopOnly() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isMobile = MOBILE_REGEX.test(ua);

    setIsDesktop(!isMobile);
  }, []);

  return isDesktop;
}
