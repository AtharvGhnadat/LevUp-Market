import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSupabaseClient } from "./supabase";

describe("Supabase Client Provider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes a valid SupabaseClient singleton", () => {
    const client = getSupabaseClient();
    expect(client).toBeDefined();
    expect(typeof client.from).toBe("function");
    expect(typeof client.auth.getSession).toBe("function");
  });

  it("returns identical instance on subsequent calls", () => {
    const clientA = getSupabaseClient();
    const clientB = getSupabaseClient();
    expect(clientA).toBe(clientB);
  });
});
