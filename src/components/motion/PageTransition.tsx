"use client";

import { useEffect, useState } from "react";

/** Set after the first page mounts, so only in-site navigations fade, never the initial load. */
let hasMountedOnce = false;

/** Short fade-in for each page reached by an in-site link (via app/template.tsx). */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => hasMountedOnce);
  useEffect(() => {
    hasMountedOnce = true;
  }, []);
  return <div className={animate ? "page-enter" : undefined}>{children}</div>;
}
