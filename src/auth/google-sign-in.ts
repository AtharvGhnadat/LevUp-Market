import { initializeApp } from "firebase/app";
import {
  browserPopupRedirectResolver,
  GoogleAuthProvider,
  inMemoryPersistence,
  initializeAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getSupabaseClient } from "@/lib/supabase";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCiee_12CzUZJY_VsuJQE5LRHVDlfz5PaY",
  authDomain: "levup-market.firebaseapp.com",
  projectId: "levup-market",
  storageBucket: "levup-market.firebasestorage.app",
  messagingSenderId: "543755432256",
  appId: "1:543755432256:web:c425d19674e1303df30aa5",
  measurementId: "G-80DZQ3NFM7",
};

export const googleSignInConfigured = Boolean(firebaseConfig.apiKey);

function createGoogleAuth() {
  const app = initializeApp(firebaseConfig, "levup-google");
  return initializeAuth(app, {
    persistence: inMemoryPersistence,
    popupRedirectResolver: browserPopupRedirectResolver,
  });
}
let auth: ReturnType<typeof createGoogleAuth> | undefined;

export async function signInWithGoogle() {
  auth ??= createGoogleAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  try {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.idToken) throw new Error("Missing Google credential");
    const { data, error } = await getSupabaseClient().auth.signInWithIdToken({
      provider: "google",
      token: credential.idToken,
      access_token: credential.accessToken,
    });
    if (error || !data.session) throw new Error("Google session exchange failed");
  } finally {
    await signOut(auth);
  }
}

export function googleErrorMessage(error: unknown) {
  const code = error && typeof error === "object" && "code" in error ? error.code : "";
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request")
    return "Google sign-in was cancelled. You can try again.";
  if (code === "auth/popup-blocked")
    return "Allow pop-ups for this site, then try Google sign-in again.";
  return "Google sign-in is unavailable. Try again or continue with email.";
}
