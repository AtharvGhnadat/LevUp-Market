import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { NavItem } from "@/data/navigation";
import { cn } from "@/lib/cn";
import { to } from "@/lib/routes";

export const navItemClass = cn(
  "relative inline-flex h-10 items-center gap-1.5 whitespace-nowrap font-sans text-[0.875rem] font-medium tracking-[-0.01em] text-alloy transition-colors hover:text-volt-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt-action",
  "after:absolute after:inset-x-0 after:bottom-1 after:h-[2px] after:origin-left after:scale-x-0 after:rounded-full after:bg-volt-action after:transition-transform hover:after:scale-x-100",
  "aria-[current=page]:after:scale-x-100",
);

/** Disclosure-style menu: click or Enter toggles, Escape and outside click close. */
export function NavDropdown({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={cn(navItemClass, active && "after:scale-x-100")}
      >
        {item.label}
        <ChevronDown
          aria-hidden="true"
          className={cn("h-3.5 w-3.5 transition-transform duration-150", open && "rotate-180")}
          strokeWidth={2}
        />
      </button>
      <div
        id={menuId}
        hidden={!open}
        className="absolute top-full left-0 z-50 mt-1.5 w-64 rounded-md border border-line bg-white p-1.5 shadow-panel"
      >
        <ul>
          {item.children?.map((child) => (
            <li key={child.href + child.label}>
              <a
                href={to(child.href)}
                className="block rounded-sm px-3 py-2 text-sm text-alloy transition-colors hover:bg-mineral focus-visible:bg-mineral focus-visible:outline-none"
              >
                {child.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
