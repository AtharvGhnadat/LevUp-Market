import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getSupabaseClient,
  isSupabaseConfigured,
  resetSupabaseClientForTesting,
  supabase,
} from "./supabase";

vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn().mockImplementation((url: string, key: string) => ({
      from: vi.fn(),
      auth: {
        getSession: vi.fn(),
      },
      _url: url,
      _key: key,
    })),
  };
});

describe("Supabase Client Provider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    resetSupabaseClientForTesting();
  });

  it("reports unconfigured when environment variables are missing", () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_ANON_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    expect(isSupabaseConfigured()).toBe(false);
  });

  it("fails closed when getSupabaseClient is invoked without credentials", () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_ANON_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    expect(() => getSupabaseClient()).toThrow(
      "Supabase client is not configured. Define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.",
    );
  });

  it("fails closed when proxy supabase property is accessed without credentials", () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_ANON_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    expect(() => supabase.from).toThrow("Supabase client is not configured");
  });

  it("initializes a valid singleton when synthetic credentials are provided", () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://synthetic-test-project.supabase.co");
    vi.stubEnv(
      "VITE_SUPABASE_ANON_KEY",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.synthetic-anon-token",
    );

    expect(isSupabaseConfigured()).toBe(true);

    const clientA = getSupabaseClient();
    const clientB = getSupabaseClient();

    expect(clientA).toBeDefined();
    expect(clientA).toBe(clientB);
    expect(typeof clientA.from).toBe("function");
    expect(typeof clientA.auth.getSession).toBe("function");
  });
});
