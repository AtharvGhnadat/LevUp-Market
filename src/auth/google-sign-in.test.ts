import { beforeEach, expect, it, vi } from "vitest";
const fixture = vi.hoisted(() => ({
  popup: vi.fn(),
  credential: vi.fn(),
  exchange: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("firebase/app", () => ({ initializeApp: vi.fn() }));
vi.mock("firebase/auth", () => ({
  initializeAuth: () => ({}),
  inMemoryPersistence: {},
  browserPopupRedirectResolver: {},
  GoogleAuthProvider: class {
    static credentialFromResult = fixture.credential;
    setCustomParameters() {}
  },
  signInWithPopup: fixture.popup,
  signOut: fixture.signOut,
}));
vi.mock("@/lib/supabase", () => ({
  getSupabaseClient: () => ({ auth: { signInWithIdToken: fixture.exchange } }),
}));
import { signInWithGoogle } from "./google-sign-in";
beforeEach(() => {
  vi.resetAllMocks();
  fixture.popup.mockResolvedValue({});
  fixture.credential.mockReturnValue({
    idToken: "fixture-google-id",
    accessToken: "fixture-access",
  });
});
it("exchanges the Google provider credential and clears the temporary Firebase session", async () => {
  fixture.exchange.mockResolvedValue({ data: { session: {} }, error: null });
  await signInWithGoogle();
  expect(fixture.exchange).toHaveBeenCalledWith({
    provider: "google",
    token: "fixture-google-id",
    access_token: "fixture-access",
  });
  expect(fixture.signOut).toHaveBeenCalledOnce();
});
it("rejects a missing workspace session and clears Firebase sign-in", async () => {
  fixture.exchange.mockResolvedValue({ data: { session: null }, error: null });
  await expect(signInWithGoogle()).rejects.toThrow();
  expect(fixture.signOut).toHaveBeenCalledOnce();
});
it("skips the workspace exchange when the popup is cancelled", async () => {
  fixture.popup.mockRejectedValue({ code: "auth/popup-closed-by-user" });
  await expect(signInWithGoogle()).rejects.toMatchObject({ code: "auth/popup-closed-by-user" });
  expect(fixture.exchange).not.toHaveBeenCalled();
});
