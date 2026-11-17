import { Menu, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { primaryNav } from "@/data/navigation";
import { to } from "@/lib/routes";
import { useCart } from "@/state/cart";
import { HeaderSearch } from "./HeaderSearch";
import { MobileMenu } from "./MobileMenu";
import { NavDropdown, navItemClass } from "./NavDropdown";
import { SearchDialog } from "./SearchDialog";

function isActive(href: string, currentPath: string) {
  return currentPath === href || (href !== "/" && currentPath.startsWith(`${href}/`));
}

export function SiteHeader({ currentPath }: { currentPath: string }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm">
      <Container className="flex h-16 items-center gap-3 sm:h-[72px] sm:gap-6 lg:h-20">
        <Logo />

        <nav aria-label="Primary" className="ml-4 hidden shrink-0 lg:block xl:ml-[30px]">
          <ul className="flex items-center gap-5 xl:gap-6">
            {primaryNav.map((item) => {
              const active =
                isActive(item.href, currentPath) ||
                Boolean(item.children?.some((c) => isActive(c.href, currentPath)));
              return (
                <li key={item.label}>
                  {item.children ? (
                    <NavDropdown item={item} active={active} />
                  ) : (
                    <a
                      href={to(item.href)}
                      aria-current={active ? "page" : undefined}
                      className={navItemClass}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-3 xl:gap-5">
          <div className="hidden xl:block">
            <HeaderSearch />
          </div>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-haspopup="dialog"
            aria-label="Search projects"
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink hover:bg-ink/5 xl:hidden"
          >
            <Search aria-hidden="true" className="h-5 w-5" />
          </button>

          <a
            href={to("/cart")}
            aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
            aria-current={currentPath === "/cart" ? "page" : undefined}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink hover:bg-ink/5"
          >
            <ShoppingCart aria-hidden="true" className="h-[22px] w-[22px]" strokeWidth={1.9} />
            <span
              aria-hidden="true"
              className="absolute top-0.5 right-0 inline-flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-copper-action px-1 text-[0.625rem] font-bold text-white"
            >
              {count}
            </span>
          </a>

          <a
            href={to("/login")}
            aria-current={currentPath === "/login" ? "page" : undefined}
            className="hidden h-[38px] shrink-0 items-center whitespace-nowrap rounded-md bg-ink px-5 font-display text-[0.8125rem] font-bold text-white transition-colors hover:bg-ink-soft sm:inline-flex"
          >
            Login / Sign Up
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink hover:bg-ink/5 lg:hidden"
          >
            <Menu aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
      </Container>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        currentPath={currentPath}
        cartCount={count}
      />
    </header>
  );
}
