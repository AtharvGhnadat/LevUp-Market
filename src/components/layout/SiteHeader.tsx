import { Menu, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/auth/auth-context";
import { useUnreadReplies } from "@/workspace/use-unread-replies";
import { useDisplayName } from "@/workspace/use-display-name";
import { initials } from "@/workspace/navigation";
import { Logo } from "@/components/brand/Logo";
import { primaryNav } from "@/data/navigation";
import { cn } from "@/lib/cn";
import { to } from "@/lib/routes";
import { useCart } from "@/state/cart";
import { AccountNavigation } from "./AccountNavigation";
import { HeaderSearch } from "./HeaderSearch";
import { MobileMenu } from "./MobileMenu";
import { NavDropdown } from "./NavDropdown";
import { SearchDialog } from "./SearchDialog";

const desktopNavigation = "(min-width: 75rem)";

function showNavigationDialog(dialog: HTMLDialogElement, trigger: HTMLButtonElement | null) {
  const root = document.documentElement;
  root.style.setProperty("--nav-scrollbar-width", `${window.innerWidth - root.clientWidth}px`);
  trigger?.focus({ preventScroll: true });
  dialog.showModal();
  dialog.querySelector<HTMLElement>("[data-initial-focus]")?.focus();
}

export function SiteHeader({ currentPath }: { currentPath: string }) {
  const [fragment, setFragment] = useState(() => window.location.hash);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  const searchDialog = useRef<HTMLDialogElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const menuDialog = useRef<HTMLDialogElement>(null);
  const { count } = useCart();
  const { state } = useAuth();
  const customer = state.status === "signed-in" ? state.user : undefined;
  const unread = useUnreadReplies(customer?.id);
  const name = useDisplayName(customer?.id, customer?.user_metadata.full_name);
  const currentHref = currentPath === "/" && fragment ? `/${fragment}` : currentPath;

  function openSearch() {
    const dialog = searchDialog.current;
    if (!dialog || dialog.open) return;
    showNavigationDialog(dialog, searchTrigger.current);
  }

  function openMenu() {
    const dialog = menuDialog.current;
    if (!dialog || dialog.open) return;
    showNavigationDialog(dialog, menuTrigger.current);
    setMenuOpen(true);
  }

  useEffect(() => {
    const desktop = window.matchMedia(desktopNavigation);
    function onLayoutChange(event: MediaQueryListEvent) {
      if (!event.matches || !menuDialog.current?.open) return;
      menuDialog.current.close();
      searchTrigger.current?.focus({ preventScroll: true });
    }

    function onShortcut(event: KeyboardEvent) {
      const target = event.target;
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.altKey ||
        event.shiftKey ||
        !(event.ctrlKey || event.metaKey) ||
        event.key.toLowerCase() !== "k" ||
        (target instanceof HTMLElement &&
          (target.isContentEditable || target.closest("input, textarea, select"))) ||
        document.querySelector("dialog:modal")
      ) {
        return;
      }
      event.preventDefault();
      openSearch();
    }

    function onHashChange() {
      setFragment(window.location.hash);
    }

    desktop.addEventListener("change", onLayoutChange);
    window.addEventListener("keydown", onShortcut);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      desktop.removeEventListener("change", onLayoutChange);
      window.removeEventListener("keydown", onShortcut);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return (
    <header className="market-header">
      <div className="market-bar">
        <Logo />

        <nav aria-label="Primary" className="hidden shrink-0 min-[75rem]:block">
          <ul className="market-primary">
            <li>
              <NavDropdown currentPath={currentPath} />
            </li>
            {primaryNav.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={to(href)}
                  aria-current={currentHref === href ? "page" : undefined}
                  className="nav-site-link"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <NavDropdown currentPath={currentPath} resources />
            </li>
            <li className="hidden min-[80rem]:block">
              <a
                href={to("/about")}
                className="nav-site-link"
                aria-current={currentPath === "/about" ? "page" : undefined}
              >
                About
              </a>
            </li>
          </ul>
        </nav>

        <div className="market-tools">
          <HeaderSearch ref={searchTrigger} onOpen={openSearch} />
          <a
            href={to("/cart")}
            aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
            aria-current={currentPath === "/cart" ? "page" : undefined}
            className={cn(
              "nav-icon-control relative",
              currentPath === "/cart" && "bg-mineral-deep",
            )}
          >
            <ShoppingCart aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
            {count > 0 && (
              <span aria-hidden="true" className="cart-count">
                {count}
              </span>
            )}
          </a>
          <div className="market-account-slot">
            <AccountNavigation currentPath={currentPath} name={name} unread={unread} />
          </div>
          <button
            ref={menuTrigger}
            type="button"
            onClick={openMenu}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="nav-icon-control sm:ms-2 sm:w-32 sm:gap-2 sm:border sm:border-line sm:bg-white sm:px-2 min-[75rem]:hidden"
          >
            {customer && (
              <span aria-hidden="true" className="account-initials relative">
                {initials(name)}
                {unread && (
                  <span className="unread-dot absolute -end-0.5 -top-0.5 ring-2 ring-white" />
                )}
              </span>
            )}
            <span className="hidden min-w-0 truncate text-sm font-medium sm:inline">
              {customer ? name.split(/\s+/u)[0] : "Menu"}
            </span>
            <Menu
              aria-hidden="true"
              className={cn("size-[18px] shrink-0", customer && "hidden sm:block")}
              strokeWidth={1.75}
            />
          </button>
        </div>
      </div>

      <SearchDialog ref={searchDialog} />
      <MobileMenu
        ref={menuDialog}
        currentHref={currentHref}
        name={name}
        unread={unread}
        currentPath={currentPath}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  );
}
