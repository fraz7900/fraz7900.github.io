import { AdvisingNav } from "@/components/advising/AdvisingNav";

export default function AdvisingLayout({ children }: LayoutProps<"/advising">) {
  return (
    <>
      <AdvisingNav />
      <div className="page-container flex flex-col gap-20 py-14 sm:py-20">{children}</div>
    </>
  );
}
