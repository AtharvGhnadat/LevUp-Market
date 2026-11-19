import { describe, expect, it } from "vitest";
import { authEntry, safeAuthDestination } from "./auth-navigation";
import { confirmationError, emailError, newPasswordError } from "./auth-validation";
import { isSupabasePublicKey } from "@/lib/supabase-public-key";

describe("authentication return destinations", () => {
  it.each([
    ["https://example.invalid", "/dashboard"],
    ["//example.invalid/checkout", "/dashboard"],
    ["/\\example.invalid", "/dashboard"],
    ["/%2f%2fexample.invalid", "/dashboard"],
    ["/projects/../admin", "/dashboard"],
    ["/projects/%2e%2e/checkout", "/dashboard"],
    ["/auth/callback", "/dashboard"],
    ["/admin", "/dashboard"],
    ["/account/academic", "/account/academic"],
    ["/dashboard/orders?order=LP-07", "/dashboard/orders?order=LP-07"],
    ["/account/missing", "/dashboard"],
    ["/checkout?source=cart#summary", "/checkout?source=cart#summary"],
    ["/projects/esp32-smart-irrigation-system", "/projects/esp32-smart-irrigation-system"],
  ])("validates %s", (input, output) => {
    expect(safeAuthDestination(input)).toBe(output);
  });

  it("keeps internal query parameters inside the redirect parameter", () => {
    expect(authEntry("/login", "/projects?q=ESP32%20board")).toBe(
      "/login?next=%2Fprojects%3Fq%3DESP32%2520board",
    );
  });
});

describe("account input and credential boundaries", () => {
  it("validates email, password length in characters and bytes, and confirmation", () => {
    expect(emailError("invalid")).toBeDefined();
    expect(emailError(" user@example.invalid ")).toBeUndefined();
    expect(newPasswordError("short")).toBeDefined();
    expect(newPasswordError("correct long password")).toBeUndefined();
    expect(newPasswordError("\u00e9".repeat(37))).toMatch(/72 bytes/);
    expect(confirmationError("one", "two")).toMatch(/do not match/);
    expect(confirmationError("one", "one")).toBeUndefined();
  });

  it("accepts explicitly public key families and rejects privileged browser credentials", () => {
    const legacy = (role: string) =>
      `header.${btoa(JSON.stringify({ role })).replace(/=+$/, "")}.signature`;
    expect(isSupabasePublicKey("sb_publishable_synthetic_test")).toBe(true);
    expect(isSupabasePublicKey(legacy("anon"))).toBe(true);
    expect(isSupabasePublicKey(legacy("service_role"))).toBe(false);
    expect(isSupabasePublicKey("sb_secret_synthetic_test")).toBe(false);
    expect(isSupabasePublicKey("header.invalid.signature")).toBe(false);
  });
});
