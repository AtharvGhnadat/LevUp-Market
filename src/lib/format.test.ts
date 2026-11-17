import { describe, it, expect } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats integer paise into INR currency representation", () => {
    expect(formatPrice(499900)).toBe("₹4,999");
    expect(formatPrice(1000000)).toBe("₹10,000");
    expect(formatPrice(649900)).toBe("₹6,499");
  });

  it("formats 0 paise correctly", () => {
    expect(formatPrice(0)).toBe("₹0");
  });

  it("handles negative or small amounts gracefully", () => {
    expect(formatPrice(50)).toBe("₹1"); // Math.round(50 / 100) = 1
  });
});
