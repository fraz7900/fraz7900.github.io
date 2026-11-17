import type { StepView } from "@/lib/advising/bookingFlow";

/** Compact "Choose focus → Pick time → Confirm" indicator. It reflects state; it never confirms a booking. */
export function BookingProgress({ steps }: { steps: readonly StepView[] }) {
  return (
    <ol aria-label="Booking progress" className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-xs">
      {steps.map((step, index) => (
        <li key={step.label} className="flex items-center gap-2" aria-current={step.status === "current" ? "step" : undefined}>
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 motion-safe:transition-colors motion-safe:duration-200 ${
              step.status === "current"
                ? "border-accent bg-accent-soft/40 text-ink"
                : step.status === "done"
                  ? "border-line text-accent"
                  : "border-line text-faint"
            }`}
          >
            <span aria-hidden="true">{step.status === "done" ? "✓" : String(index + 1).padStart(2, "0")}</span>
            {step.label}
            {/* The current step is announced through aria-current; only completion needs extra text. */}
            {step.status === "done" && <span className="sr-only">(done)</span>}
            {step.note && <span className="hidden text-faint sm:inline">· {step.note}</span>}
          </span>
          {index < steps.length - 1 && (
            <span aria-hidden="true" className="text-faint">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
