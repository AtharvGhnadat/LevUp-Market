import { useEffect, useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { to } from "@/lib/routes";

type Mode = "confirmation" | "recovery";
type LinkState = { status: "checking" | "invalid" } | { status: "ready"; userId: string };

async function verifyLink(code: string, mode: Mode): Promise<LinkState> {
  if (!code || code.length > 2048) return { status: "invalid" };
  try {
    const auth = getSupabaseClient().auth;
    let recoveryToken: string | undefined;
    const {
      data: { subscription },
    } = auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") recoveryToken = session?.access_token;
    });
    const { data, error } = await auth
      .exchangeCodeForSession(code)
      .finally(() => subscription.unsubscribe());
    if (error || !data.session) return { status: "invalid" };
    if ((recoveryToken === data.session.access_token) !== (mode === "recovery")) {
      await auth.signOut({ scope: "local" });
      return { status: "invalid" };
    }
    const verified = await auth.getUser(data.session.access_token);
    if (
      verified.error ||
      !verified.data.user?.email_confirmed_at ||
      verified.data.user.is_anonymous
    ) {
      await auth.signOut({ scope: "local" });
      return { status: "invalid" };
    }
    return { status: "ready", userId: verified.data.user.id };
  } catch {
    return { status: "invalid" };
  }
}

export function useAuthLink(mode: Mode, redirect?: () => void) {
  const [code] = useState(() => {
    const query = new URLSearchParams(window.location.search);
    return query.has("error") || query.has("error_code") ? "" : (query.get("code") ?? "");
  });
  const [state, setState] = useState<LinkState>({ status: "checking" });
  const operation = useRef<Promise<LinkState> | null>(null);

  useEffect(() => {
    const path = mode === "recovery" ? "/reset-password" : "/auth/callback";
    window.history.replaceState(null, "", to(path));
    operation.current ??= verifyLink(code, mode);
    let active = true;
    void operation.current.then((result) => {
      if (!active) return;
      if (result.status === "ready" && redirect) redirect();
      else setState(result);
    });
    return () => {
      active = false;
    };
  }, [code, mode, redirect]);

  return state;
}
