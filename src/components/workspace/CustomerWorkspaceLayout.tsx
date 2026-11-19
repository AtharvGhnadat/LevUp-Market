import { useEffect, type ReactNode } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useAuth } from "@/auth/auth-context";
import { authEntry, safeAuthDestination } from "@/auth/auth-navigation";
import { workspaceLinks, accountLink } from "@/workspace/navigation";
import { to } from "@/lib/routes";

type Props = {
  path: string;
  title: string;
  description: string;
  children: (user: User) => ReactNode;
};
export function CustomerWorkspaceLayout({ path, title, description, children }: Props) {
  const { state, signOutPending, signOutError } = useAuth();
  const expired = state.status === "signed-out" && state.expired;
  const status = state.status;
  useEffect(() => {
    if ((status === "signed-out" || status === "recovering") && !signOutPending && !signOutError) {
      const params = new URLSearchParams({
        next: safeAuthDestination(path + window.location.search),
      });
      if (expired) params.set("reason", "expired");
      window.location.replace(to("/login?" + params));
    }
  }, [status, signOutError, signOutPending, expired, path]);
  useEffect(() => {
    const previous = document.title;
    document.title = title + " · LevUp Projects";
    return () => {
      document.title = previous;
    };
  }, [title]);
  if (state.status !== "signed-in")
    return (
      <section className="workspace-gate">
        <h1>{title}</h1>
        {signOutError || status === "unavailable" ? (
          <div role="alert">
            <p>{signOutError || "We couldn’t verify your session."}</p>
            <a className="workspace-link" href={authEntry("/login", path)}>
              Sign In
            </a>
          </div>
        ) : (
          <p role="status">
            {signOutPending
              ? "Signing out…"
              : status === "loading"
                ? "Checking your session…"
                : "Taking you to Sign In…"}
          </p>
        )}
      </section>
    );
  const isSettings = path.startsWith("/account");
  const parent =
    isSettings && path !== "/account"
      ? accountLink
      : path === "/dashboard"
        ? null
        : workspaceLinks[0];
  return (
    <div className="workspace-shell" key={state.user.id}>
      <aside className="workspace-rail">
        <nav aria-label="Workspace">
          <a className="workspace-back" href={to("/projects")}>
            <ArrowLeft size={15} aria-hidden="true" />
            Project catalog
          </a>
          <p className="mt-6 mb-2 px-3 text-sm font-semibold text-muted">My workspace</p>
          {workspaceLinks.map(({ href, label }) => (
            <a
              key={href}
              href={to(href)}
              aria-current={path === href ? "page" : undefined}
              className="workspace-nav-link"
            >
              {label}
            </a>
          ))}
          <div className="mt-4 border-t border-line pt-3">
            <a
              className="workspace-nav-link"
              href={to("/account")}
              aria-current={isSettings ? (path === "/account" ? "page" : "location") : undefined}
            >
              {accountLink.label}
            </a>
          </div>
        </nav>
      </aside>
      <section className="workspace-content customer-enter" aria-labelledby="workspace-title">
        <nav aria-label="Breadcrumb" className="workspace-crumb">
          <a href={to(parent?.href ?? "/")}>{parent?.label ?? "Storefront"}</a>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page">{title}</span>
        </nav>
        <h1 id="workspace-title" tabIndex={-1} className="workspace-title">
          {title}
        </h1>
        <p className="workspace-intro">{description}</p>
        {children(state.user)}
      </section>
    </div>
  );
}
