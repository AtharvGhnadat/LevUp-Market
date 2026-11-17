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
          className="sr-only z-50 rounded-sm bg-ink px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
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
      <p className="text-sm text-muted">Loading project library…</p>
      <div className="mt-6 h-2 w-48 animate-pulse rounded-full bg-paper-deep" />
    </div>
  );
}
