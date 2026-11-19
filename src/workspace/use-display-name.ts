import { useEffect, useState } from "react";
import { accountName } from "./navigation";

// Fetch only the two public-facing name fields for account navigation.
export function useDisplayName(owner: string | undefined, fallback: unknown) {
  const [profile, setProfile] = useState<{ id: string; name: string } | null>(null);
  useEffect(() => {
    if (!owner) return;
    let active = true,
      updated = false;
    void import("@/lib/supabase")
      .then(async ({ getSupabaseClient }) => {
        const { data } = await getSupabaseClient()
          .from("profiles")
          .select("display_name,full_name")
          .eq("id", owner)
          .maybeSingle();
        if (active && !updated && data && (data.display_name || data.full_name))
          setProfile({ id: owner, name: accountName(data.display_name || data.full_name) });
      })
      .catch(() => {
        /* The verified account still has a display fallback. */
      });
    function onChange(event: Event) {
      const detail = (event as CustomEvent<{ id: string; name: string }>).detail;
      if (detail?.id === owner) {
        updated = true;
        setProfile({ id: detail.id, name: accountName(detail.name) });
      }
    }
    window.addEventListener("levup:profile-name", onChange);
    return () => {
      active = false;
      window.removeEventListener("levup:profile-name", onChange);
    };
  }, [owner]);
  return owner && profile?.id === owner ? profile.name : accountName(fallback);
}
