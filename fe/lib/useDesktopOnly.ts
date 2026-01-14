"use client";

import { useEffect, useState } from "react";

export function useDesktopOnly() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isDesktop;
}
