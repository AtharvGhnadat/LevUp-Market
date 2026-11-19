import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import {
  allProjectsLink,
  currentProjectLink,
  projectCategoryLinks,
  resourceLinks,
} from "@/data/navigation";
import { cn } from "@/lib/cn";
import { to } from "@/lib/routes";

export function NavDropdown({
  currentPath,
  resources = false,
}: {
  currentPath: string;
  resources?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const inProjects = currentPath === "/projects" || currentPath.startsWith("/projects/");
  const selectedHref = resources
    ? currentPath
    : currentProjectLink(currentPath, window.location.search);
  const landing = resources ? { href: "/resources", label: "All resources" } : allProjectsLink;
  const links = resources ? resourceLinks : projectCategoryLinks;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          event.preventDefault();
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-current={
          (resources ? currentPath.startsWith("/resources") || currentPath === "/faq" : inProjects)
            ? "location"
            : undefined
        }
        aria-expanded={open}
        aria-controls={menuId}
        onClick={(event) => {
          event.currentTarget.focus({ preventScroll: true });
          setOpen((value) => !value);
        }}
        className="nav-site-link"
      >
        {resources ? "Resources" : "Projects"}
        <ChevronDown
          aria-hidden="true"
          className={cn("size-4 transition-transform duration-150", open && "rotate-180")}
          strokeWidth={1.75}
        />
      </button>

      <div
        id={menuId}
        hidden={!open}
        className={cn(
          "nav-flyout absolute start-0 top-full z-50 mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-lg border border-line bg-white p-2 shadow-panel",
          resources ? "w-56" : "w-[25rem]",
        )}
      >
        <a
          href={to(landing.href)}
          aria-current={selectedHref === landing.href ? "page" : undefined}
          className="nav-panel-link justify-between"
          onClick={() => setOpen(false)}
        >
          {landing.label}
          <ArrowRight aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />
        </a>
        <ul
          className={cn("mt-2 grid gap-1 border-t border-line pt-2", !resources && "grid-cols-2")}
        >
          {links.map(({ href, label }) => (
            <li key={href}>
              <a
                href={to(href)}
                aria-current={selectedHref === href ? "page" : undefined}
                className="nav-panel-link h-full"
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            </li>
          ))}
          {resources && (
            <li className="min-[80rem]:hidden">
              <a className="nav-panel-link" href={to("/about")}>
                About
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
