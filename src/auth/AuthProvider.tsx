import { useEffect, useRef, useState, type ReactNode } from "react";
import { isSupabaseConfigured } from "@/lib/supabase-config";
import { to } from "@/lib/routes";
import { isRecoveryAccount, setRecoveryAccount } from "./auth-navigation";
import { AuthContext, type AuthState } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => ({
    status: isSupabaseConfigured() ? "loading" : "unavailable",
  }));
  const [signOutPending, setSignOutPending] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const signingOut = useRef(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let active = true;
    let revision = 0;
    let hadSession = false;
    let sessionOwner: string | null = null;
    let timer: number | undefined;
    let activeSubscription: { unsubscribe: () => void } | undefined;
    const accept = (value: AuthState) => {
      if (active) setState(value);
    };

    void import("@/lib/supabase")
      .then(({ getSupabaseClient }) => {
        if (!active) return;
        const auth = getSupabaseClient().auth;
        const {
          data: { subscription },
        } = auth.onAuthStateChange((event, session) => {
          const current = ++revision;
          window.clearTimeout(timer);
          if (!session) {
            accept({ status: "signed-out", expired: hadSession && !signingOut.current });
            hadSession = false;
            sessionOwner = null;
            return;
          }

          hadSession = true;
          if (session.user.id !== sessionOwner) accept({ status: "loading" });
          sessionOwner = session.user.id;
          if (event === "PASSWORD_RECOVERY") setRecoveryAccount(session.user.id);
          if (event === "PASSWORD_RECOVERY" || isRecoveryAccount(session.user.id)) {
            accept({ status: "recovering" });
            return;
          }

          // Leave Supabase's event callback before requesting a verified user.
          timer = window.setTimeout(() => {
            const acceptCurrent = (value: AuthState) => {
              if (current === revision) accept(value);
            };
            void auth.getUser(session.access_token).then(
              ({ data, error }) => {
                if (error) {
                  if (
                    error.status === 401 ||
                    error.status === 403 ||
                    error.name === "AuthSessionMissingError"
                  ) {
                    acceptCurrent({ status: "signed-out", expired: true });
                  } else {
                    acceptCurrent({ status: "unavailable" });
                  }
                  return;
                }
                const user = data.user;
                if (user?.email && user.email_confirmed_at && !user.is_anonymous) {
                  acceptCurrent({ status: "signed-in", user });
                } else {
                  acceptCurrent({ status: "signed-out", expired: false });
                }
              },
              () => acceptCurrent({ status: "unavailable" }),
            );
          }, 0);
        });

        activeSubscription = subscription;
      })
      .catch(() => accept({ status: "unavailable" }));

    return () => {
      active = false;
      window.clearTimeout(timer);
      activeSubscription?.unsubscribe();
    };
  }, []);

  async function signOut() {
    if (signingOut.current) return;
    signingOut.current = true;
    setSignOutPending(true);
    setSignOutError("");
    try {
      const { getSupabaseClient } = await import("@/lib/supabase");
      const { error } = await getSupabaseClient().auth.signOut({ scope: "local" });
      if (error) throw error;
      setRecoveryAccount(null);
      window.location.replace(to("/"));
    } catch {
      let localSessionExists = true;
      try {
        const { getSupabaseClient } = await import("@/lib/supabase");
        const { data } = await getSupabaseClient().auth.getSession();
        localSessionExists = Boolean(data.session);
      } catch {
        // If the browser session cannot be read, leave the retry available.
      }
      if (!localSessionExists) setRecoveryAccount(null);
      setSignOutError(
        localSessionExists
          ? "We couldn't sign you out. Please try again."
          : "You’re signed out on this device. We couldn't confirm that the session was revoked.",
      );
      signingOut.current = false;
      setSignOutPending(false);
    }
  }

  return (
    <AuthContext.Provider value={{ state, signOut, signOutPending, signOutError }}>
      {children}
    </AuthContext.Provider>
  );
}
