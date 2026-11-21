import {
  ChevronDown,
  LogOut,
  Bell,
  House,
  Layers,
  Wrench,
  Package,
  Mail,
  Headphones,
  Settings,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useAuth } from "@/auth/auth-context";
import { accountLink, workspaceLinks, initials } from "@/workspace/navigation";
import { authEntry } from "@/auth/auth-navigation";
import { to } from "@/lib/routes";

const icons = {
  "/dashboard": House,
  "/dashboard/projects": Layers,
  "/dashboard/custom-requests": Wrench,
  "/dashboard/orders": Package,
  "/dashboard/messages": Mail,
  "/dashboard/support": Headphones,
};

export function AccountNavigation({
  mobile,
  currentPath,
  name,
  unread,
}: {
  mobile?: boolean;
  name: string;
  unread: boolean;
  currentPath: string;
}) {
  const { state, signOutPending, signOutError, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const widget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !widget.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  if (state.status === "loading" || (signOutPending && state.status !== "signed-in")) {
    return (
      <span
        role="status"
        className={
          mobile
            ? "block px-3 py-2 text-sm text-muted"
            : "inline-flex min-h-11 min-w-44 items-center justify-end px-2 text-sm text-muted"
        }
      >
        {signOutPending ? "Signing out…" : "Checking account…"}
      </span>
    );
  }

  if (state.status === "recovering") return null;

  if (state.status !== "signed-in") {
    const returnTo =
      ["/cart", "/checkout", "/custom-project"].includes(currentPath) ||
      currentPath.startsWith("/projects/")
        ? currentPath + window.location.search
        : "/dashboard";
    return (
      <div
        className={
          mobile
            ? "flex flex-wrap items-center gap-2 px-2"
            : "relative flex shrink-0 items-center gap-1"
        }
      >
        <a
          className="market-sign-in"
          href={authEntry("/login", returnTo)}
          aria-current={currentPath === "/login" ? "page" : undefined}
        >
          Sign In
        </a>
        <a
          href={authEntry("/signup", returnTo)}
          className="market-create"
          aria-current={currentPath === "/signup" ? "page" : undefined}
        >
          Create Account
        </a>
        {signOutError && (
          <p
            role="alert"
            className={
              mobile
                ? "basis-full px-1 text-sm text-red-800"
                : "absolute end-0 top-full z-50 mt-2 w-56 rounded-md border border-line bg-white p-3 text-sm text-red-800 shadow-card"
            }
          >
            {signOutError}
          </p>
        )}
      </div>
    );
  }

  const links = (
    <>
      {mobile && (
        <div className="flex min-w-0 items-center gap-3 border-b border-line px-3 py-3">
          <span className="account-initials" aria-hidden="true">
            {initials(name)}
          </span>
          <span className="min-w-0 wrap-anywhere font-display font-semibold">{name}</span>
        </div>
      )}
      {workspaceLinks.length > 0 && (
        <section aria-label="My workspace">
          {mobile && <h3 className="nav-group-title">My workspace</h3>}
          {workspaceLinks.map(({ href, label }) => {
            const Icon = icons[href as keyof typeof icons];
            return (
              <a
                key={href}
                href={to(href)}
                aria-current={currentPath === href ? "page" : undefined}
                className={
                  "nav-panel-link account-row " +
                  (href === "/dashboard/support" ? "account-support" : "")
                }
              >
                <Icon size={18} strokeWidth={1.65} aria-hidden="true" />
                {label}
                {href === "/dashboard/messages" && unread && (
                  <span className="unread-dot" aria-label="Unread replies" />
                )}
              </a>
            );
          })}
        </section>
      )}
      <section aria-label="Account" className="mt-1">
        <a
          href={to(accountLink.href)}
          aria-current={
            currentPath === accountLink.href
              ? "page"
              : currentPath.startsWith("/account/")
                ? "location"
                : undefined
          }
          className="nav-panel-link account-row"
        >
          <Settings size={18} strokeWidth={1.65} aria-hidden="true" />
          {accountLink.label}
        </a>
        <button
          type="button"
          disabled={signOutPending}
          onClick={() => void signOut()}
          className="nav-panel-link account-row account-signout w-full disabled:opacity-60"
        >
          <LogOut size={18} aria-hidden="true" />
          {signOutPending ? "Signing out…" : "Sign Out"}
        </button>
        {signOutError && (
          <p role="alert" className="px-3 py-1 text-sm text-red-800">
            {signOutError}
          </p>
        )}
      </section>
    </>
  );
  if (mobile) return <div>{links}</div>;

  return (
    <>
      <a
        href={to("/dashboard/messages")}
        className="nav-icon-control relative"
        aria-label={unread ? "Notifications, unread messages" : "Notifications"}
      >
        <Bell size={19} strokeWidth={1.7} aria-hidden="true" />
        {unread && <span className="unread-dot absolute end-2 top-2" aria-hidden="true" />}
      </a>
      <div
        ref={widget}
        className="relative min-w-0"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}
        onKeyDown={(event) => {
          if (open && event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
            trigger.current?.focus();
          }
        }}
      >
        <button
          ref={trigger}
          type="button"
          aria-label="Account"
          aria-controls={menuId}
          aria-expanded={open}
          onClick={(event) => {
            event.currentTarget.focus({ preventScroll: true });
            setOpen((value) => !value);
          }}
          className="market-identity"
        >
          <span className="account-initials" aria-hidden="true">
            {initials(name)}
          </span>
          <span className="min-w-0 truncate">{name}</span>
          <ChevronDown aria-hidden="true" className="size-4" strokeWidth={1.75} />
        </button>
        <div
          id={menuId}
          hidden={!open}
          className="nav-flyout absolute end-0 top-full z-50 mt-2 max-h-[calc(100dvh-6rem)] w-64 overflow-y-auto rounded-lg border border-line bg-white p-2 shadow-panel"
        >
          {links}
        </div>
      </div>
    </>
  );
}
