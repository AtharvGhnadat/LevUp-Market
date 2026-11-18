import { currentRoute } from "@/lib/routes";
import { lazy, Suspense } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HomePage } from "@/pages/HomePage";
import { PlannedRoutePage } from "@/pages/PlannedRoutePage";
import { CartProvider } from "@/state/cart";

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

/**
 * Minimal path switch for the public shell. Maps 1:1 onto the Next.js App Router
 * routes in the PRD when the platform migrates (app/page.tsx, app/projects/..., etc.).
 */
export default function App() {
  const path = currentRoute();

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-alloy px-4 py-2 font-sans text-sm font-semibold text-white shadow-md focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:ring-2 focus:ring-volt-action focus:outline-none"
        >
          Skip to content
        </a>
        <SiteHeader currentPath={path} />
        <main id="main" className="flex-1">
          {path === "/" ? (
            <HomePage />
          ) : path === "/projects" ? (
            <Suspense fallback={<PageLoading />}>
              <ProjectsPage />
            </Suspense>
          ) : path.startsWith("/projects/") ? (
            <Suspense fallback={<PageLoading />}>
              <ProjectDetailPage slug={decodeURIComponent(path.slice("/projects/".length))} />
            </Suspense>
          ) : path === "/cart" ? (
            <Suspense fallback={<PageLoading />}>
              <CartPage />
            </Suspense>
          ) : path === "/checkout" ? (
            <Suspense fallback={<PageLoading />}>
              <CheckoutPage />
            </Suspense>
          ) : path === "/checkout/return" || path.startsWith("/checkout/return") ? (
            <Suspense fallback={<PageLoading />}>
              <CheckoutReturnPage />
            </Suspense>
          ) : (
            <PlannedRoutePage path={path} />
          )}
        </main>
        <SiteFooter />
      </div>
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
