const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Monetary values are stored as integer minor units (paise), per the PRD. */
export function formatPrice(minorUnits: number): string {
  return inr.format(minorUnits / 100);
}
