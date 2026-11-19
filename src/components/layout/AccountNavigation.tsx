import { ChevronDown, LogOut } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useAuth } from "@/auth/auth-context";
import { accountLink, workspaceLinks, initials } from "@/workspace/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { to } from "@/lib/routes";

export function AccountNavigation({
  mobile,
  currentPath,
  name,
}: {
  mobile?: boolean;
  name: string;
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
    return (
      <div
        className={
          mobile
            ? "flex flex-wrap items-center gap-2 px-2"
            : "relative flex shrink-0 items-center gap-1"
        }
      >
        <a
          className="nav-site-link"
          href={to("/login")}
          aria-current={currentPath === "/login" ? "page" : undefined}
        >
          Sign In
        </a>
        <ButtonLink
          href={to("/signup")}
          variant="ink"
          className="px-4 font-sans"
          aria-current={currentPath === "/signup" ? "page" : undefined}
        >
          Create Account
        </ButtonLink>
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
      <div className="flex min-w-0 items-center gap-3 border-b border-line px-3 py-3">
        <span className="account-initials" aria-hidden="true">
          {initials(name)}
        </span>
        <span className="min-w-0 break-words font-display font-semibold">{name}</span>
      </div>
      {workspaceLinks.length > 0 && (
        <section aria-label="My workspace">
          <h3 className="nav-group-title">My workspace</h3>
          {workspaceLinks.map(({ href, label }) => (
            <a
              key={href}
              href={to(href)}
              aria-current={currentPath === href ? "page" : undefined}
              className="nav-panel-link"
            >
              {label}
            </a>
          ))}
        </section>
      )}
      <section aria-label="Account" className="mt-2 border-t border-line pt-1">
        <a
          href={to(accountLink.href)}
          aria-current={currentPath === accountLink.href ? "page" : undefined}
          className="nav-panel-link"
        >
          {accountLink.label}
        </a>
        <button
          type="button"
          disabled={signOutPending}
          onClick={() => void signOut()}
          className="nav-panel-link w-full justify-between disabled:opacity-60"
        >
          {signOutPending ? "Signing out…" : "Sign Out"} <LogOut size={16} aria-hidden="true" />
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
    <div
      ref={widget}
      className="relative shrink-0"
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
        onClick={() => setOpen((value) => !value)}
        className="nav-site-link max-w-48 border border-line bg-white px-2.5"
      >
        <span className="account-initials" aria-hidden="true">
          {initials(name)}
        </span>
        <span className="min-w-0 truncate">{name.split(/\s+/u)[0]}</span>
        <ChevronDown aria-hidden="true" className="size-4" strokeWidth={1.75} />
      </button>
      <div
        id={menuId}
        hidden={!open}
        className="nav-flyout absolute end-0 top-full z-50 mt-2 max-h-[calc(100dvh-6rem)] w-64 overflow-y-auto rounded-lg border border-line bg-white p-2 shadow-card"
      >
        {links}
      </div>
    </div>
  );
}
