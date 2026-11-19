import { currentRoute } from "@/lib/routes";
import { lazy, Suspense, useEffect } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HomePage } from "@/pages/HomePage";
import { PlannedRoutePage } from "@/pages/PlannedRoutePage";
import { CartProvider } from "@/state/cart";
import { AuthProvider } from "@/auth/AuthProvider";
import { authEntry, safeAuthDestination } from "@/auth/auth-navigation";

const ProjectsPage = lazy(() =>
  import("@/pages/ProjectsPage").then((module) => ({ default: module.ProjectsPage })),
);
const ProjectDetailPage = lazy(() =>
  import("@/pages/ProjectDetailPage").then((module) => ({
    default: module.ProjectDetailPage,
  })),
);
const CartPage = lazy(() =>
  import("@/pages/CartPage").then((module) => ({ default: module.CartPage })),
);
const CheckoutPage = lazy(() =>
  import("@/pages/CheckoutPage").then((module) => ({ default: module.CheckoutPage })),
);
const CheckoutReturnPage = lazy(() =>
  import("@/pages/CheckoutReturnPage").then((module) => ({
    default: module.CheckoutReturnPage,
  })),
);
const CustomProjectPage = lazy(() =>
  import("@/pages/CustomProjectPage").then((module) => ({
    default: module.CustomProjectPage,
  })),
);
const AuthCredentialsPage = lazy(() =>
  import("@/pages/AuthCredentialsPage").then((module) => ({ default: module.AuthCredentialsPage })),
);
const ForgotPasswordPage = lazy(() =>
  import("@/pages/AuthRecoveryPage").then((module) => ({ default: module.ForgotPasswordPage })),
);
const ResetPasswordPage = lazy(() =>
  import("@/pages/AuthRecoveryPage").then((module) => ({ default: module.ResetPasswordPage })),
);
const AuthCallbackPage = lazy(() =>
  import("@/pages/AuthRecoveryPage").then((module) => ({ default: module.AuthCallbackPage })),
);
const AccountPage = lazy(() =>
  import("@/pages/AccountPage").then((module) => ({ default: module.AccountPage })),
);

function SignupRedirect() {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    window.location.replace(authEntry("/signup", safeAuthDestination(query.get("next"))));
  }, []);
  return (
    <p role="status" className="mx-auto w-full max-w-[1348px] px-5 py-20">
      Opening account setup…
    </p>
  );
}

const authPages = {
  "/login": <AuthCredentialsPage mode="login" />,
  "/signup": <AuthCredentialsPage mode="signup" />,
  "/register": <SignupRedirect />,
  "/forgot-password": <ForgotPasswordPage />,
  "/reset-password": <ResetPasswordPage />,
  "/auth/callback": <AuthCallbackPage />,
  "/account": <AccountPage />,
};

/**
 * Minimal path switch for the public shell. Maps 1:1 onto the Next.js App Router
 * routes in the PRD when the platform migrates (app/page.tsx, app/projects/..., etc.).
 */
export default function App() {
  const path = currentRoute();
  const authPage = Object.prototype.hasOwnProperty.call(authPages, path)
    ? authPages[path as keyof typeof authPages]
    : null;

  return (
    <CartProvider>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <a
            href="#main"
            className="sr-only z-50 rounded-md bg-alloy px-4 py-2 font-sans text-sm font-semibold text-white shadow-md focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:ring-2 focus:ring-volt-action focus:outline-none"
          >
            Skip to content
          </a>
          <SiteHeader currentPath={path} />
          <main id="main" className="flex-1">
            {authPage ? (
              <Suspense fallback={<PageLoading />}>{authPage}</Suspense>
            ) : path === "/" ? (
              <HomePage />
            ) : path === "/projects" ? (
              <Suspense fallback={<PageLoading />}>
                <ProjectsPage />
              </Suspense>
            ) : path.startsWith("/projects/") ? (
              (() => {
                try {
                  const slug = decodeURIComponent(path.slice("/projects/".length)).trim();
                  if (!slug) return <PlannedRoutePage path={path} />;
                  return (
                    <Suspense fallback={<PageLoading />}>
                      <ProjectDetailPage slug={slug} />
                    </Suspense>
                  );
                } catch {
                  return <PlannedRoutePage path={path} />;
                }
              })()
            ) : path === "/custom-project" ? (
              <Suspense fallback={<PageLoading />}>
                <CustomProjectPage />
              </Suspense>
            ) : path === "/cart" ? (
              <Suspense fallback={<PageLoading />}>
                <CartPage />
              </Suspense>
            ) : path === "/checkout" ? (
              <Suspense fallback={<PageLoading />}>
                <CheckoutPage />
              </Suspense>
            ) : path === "/checkout/return" ? (
              <Suspense fallback={<PageLoading />}>
                <CheckoutReturnPage />
              </Suspense>
            ) : (
              <PlannedRoutePage path={path} />
            )}
          </main>
          <SiteFooter compact={Boolean(authPage)} />
        </div>
      </AuthProvider>
    </CartProvider>
  );
}

function PageLoading() {
  return (
    <div className="mx-auto w-full max-w-[1348px] px-5 py-20 sm:px-8" role="status">
      <p className="text-sm text-muted">Loading page content…</p>
      <div className="mt-6 h-2 w-48 animate-pulse rounded-full bg-paper-deep" />
    </div>
  );
}
