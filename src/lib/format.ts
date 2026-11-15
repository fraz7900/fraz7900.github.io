const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const decimal = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

/** Whole-dollar currency with a true minus sign for negatives, e.g. "−$300". */
export function formatUsd(value: number): string {
  const formatted = usd.format(Math.abs(value));
  return value < 0 && Math.round(Math.abs(value)) !== 0 ? `−${formatted}` : formatted;
}

/** Up to one decimal place, e.g. "2" or "2.4". */
export function formatDecimal(value: number): string {
  return decimal.format(value);
}
