"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useMotionPreferences } from "./useMotionPreferences";

const SELECTOR = "[data-reveal]";

/**
 * Fades `data-reveal` blocks in the first time they scroll into view. Content is visible in the
 * static HTML; only blocks still below the fold are hidden, and only once this has run, so
 * nothing on screen flashes. With reduced motion or no IntersectionObserver, nothing is hidden.
 */
export function RevealOnScroll() {
  const pathname = usePathname();
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    const blocks = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    const show = (el: HTMLElement) => {
      el.dataset.reveal = "shown";
    };
    if (reducedMotion || !("IntersectionObserver" in window)) {
      blocks.forEach(show);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          show(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );
    blocks
      .filter((el) => el.dataset.reveal !== "shown")
      .forEach((el) => {
        const box = el.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) {
          show(el);
          return;
        }
        el.dataset.reveal = "pending";
        observer.observe(el);
      });
    return () => observer.disconnect();
  }, [pathname, reducedMotion]);

  return null;
}
