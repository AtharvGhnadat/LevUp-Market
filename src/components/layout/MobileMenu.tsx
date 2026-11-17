import { ChevronDown, ShoppingCart, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { primaryNav } from "@/data/navigation";
import { cn } from "@/lib/cn";
import { to } from "@/lib/routes";

type Props = { open: boolean; onClose: () => void; currentPath: string; cartCount: number };

export function MobileMenu({ open, onClose, currentPath, cartCount }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      id="mobile-menu"
      aria-label="Site navigation"
      onClose={onClose}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-paper p-0 text-ink backdrop:bg-ink/40 lg:hidden"
    >
      <div className="flex h-[72px] items-center justify-between border-b border-line px-5">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm p-2 hover:bg-ink/5"
          aria-label="Close menu"
        >
          <X aria-hidden="true" className="h-6 w-6" />
        </button>
      </div>

      <nav aria-label="Mobile" className="px-5 py-4">
        <ul>
          {primaryNav.map((item) => (
            <li key={item.label} className="border-b border-line">
              {item.children ? (
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
                    {item.label}
                    <ChevronDown
                      aria-hidden="true"
                      className="h-5 w-5 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <ul className="pb-3">
                    {item.children.map((child) => (
                      <li key={child.href + child.label}>
                        <a
                          href={to(child.href)}
                          className="block rounded-sm px-3 py-2 text-[0.9375rem] text-muted hover:bg-white hover:text-ink"
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <a
                  href={to(item.href)}
                  aria-current={currentPath === item.href ? "page" : undefined}
                  className={cn(
                    "block py-4 font-display text-lg font-bold",
                    currentPath === item.href && "text-copper-ink",
                  )}
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <ButtonLink href={to("/cart")} variant="outline" size="md">
            <ShoppingCart aria-hidden="true" className="h-4 w-4" />
            Cart ({cartCount})
          </ButtonLink>
          <ButtonLink href={to("/login")} variant="ink" size="md">
            Login / Sign Up
          </ButtonLink>
        </div>
        <ButtonLink href={to("/custom-project")} size="md" className="mt-3 w-full">
          Request Custom Project
        </ButtonLink>
      </nav>
    </dialog>
  );
}
