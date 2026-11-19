import { ChevronDown, X } from "lucide-react";
import type { MouseEvent, Ref } from "react";
import {
  allProjectsLink,
  currentProjectLink,
  primaryNav,
  projectCategoryLinks,
} from "@/data/navigation";
import { to } from "@/lib/routes";

type Props = {
  ref: Ref<HTMLDialogElement>;
  currentPath: string;
  currentHref: string;
  onClose: () => void;
};

export function MobileMenu({ ref, currentPath, currentHref, onClose }: Props) {
  const selectedHref = currentProjectLink(currentPath, window.location.search);

  function onClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      event.currentTarget.close();
      return;
    }

    if (
      event.target instanceof Element &&
      event.target.closest("a[href]") &&
      event.button === 0 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.currentTarget.close();
    }
  }

  return (
    <dialog
      ref={ref}
      id="mobile-menu"
      aria-labelledby="mobile-menu-title"
      onClose={onClose}
      onClick={onClick}
      className="nav-dialog nav-drawer max-w-none overflow-y-auto rounded-lg border border-line bg-mineral p-0 text-alloy shadow-card"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-mineral px-4 py-2">
        <h2 id="mobile-menu-title" className="text-lg font-semibold">
          Site navigation
        </h2>
        <button
          type="button"
          className="nav-icon-control"
          aria-label="Close menu"
          data-initial-focus
          onClick={(event) => event.currentTarget.closest("dialog")?.close()}
        >
          <X aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
        </button>
      </div>

      <nav aria-label="Mobile" className="p-2">
        <ul>
          <li className="mb-1 border-b border-line pb-1">
            <details className="group">
              <summary className="nav-panel-link cursor-pointer list-none justify-between [&::-webkit-details-marker]:hidden">
                Projects
                <ChevronDown
                  aria-hidden="true"
                  className="size-4 shrink-0 transition-transform duration-150 group-open:rotate-180"
                  strokeWidth={1.75}
                />
              </summary>
              <ul className="space-y-1 border-s border-line pb-1 ms-3 ps-2">
                {[allProjectsLink, ...projectCategoryLinks].map(({ href, label }) => (
                  <li key={href}>
                    <a
                      href={to(href)}
                      aria-current={selectedHref === href ? "page" : undefined}
                      className="nav-panel-link"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </li>
          {primaryNav.map(({ label, href }) => (
            <li key={href}>
              <a
                href={to(href)}
                aria-current={currentHref === href ? "page" : undefined}
                className="nav-panel-link"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </dialog>
  );
}
