import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

export type AuthState =
  | { status: "loading" | "unavailable" | "recovering" }
  | { status: "signed-out"; expired: boolean }
  | { status: "signed-in"; user: User };

export type AuthContextValue = {
  state: AuthState;
  signOut: () => Promise<void>;
  signOutPending: boolean;
  signOutError: string;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth requires AuthProvider");
  return context;
}
