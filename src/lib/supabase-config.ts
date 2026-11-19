import { isSupabasePublicKey } from "./supabase-public-key";

function firstConfiguredValue(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function getSupabaseUrl(): string {
  const env = typeof process === "undefined" ? undefined : process.env;
  return firstConfiguredValue(
    import.meta.env.VITE_SUPABASE_URL,
    env?.NEXT_PUBLIC_SUPABASE_URL,
    env?.SUPABASE_URL,
  );
}

export function getSupabaseAnonKey(): string {
  const env = typeof process === "undefined" ? undefined : process.env;
  return firstConfiguredValue(
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    env?.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    env?.SUPABASE_ANON_KEY,
  );
}

export function isSupabaseConfigured(): boolean {
  const value = getSupabaseUrl();
  if (!value || value.includes("your-project-id") || value.includes("your-supabase-url"))
    return false;
  if (!isSupabasePublicKey(getSupabaseAnonKey())) return false;
  try {
    const url = new URL(value);
    if (url.username || url.password || url.search || url.hash) return false;
    return (
      url.protocol === "https:" ||
      (url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
    );
  } catch {
    return false;
  }
}
