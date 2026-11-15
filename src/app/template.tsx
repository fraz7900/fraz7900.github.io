import { PageTransition } from "@/components/motion/PageTransition";

/** Templates remount on every navigation, which is what lets each new page fade in. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
