import { useEffect } from "react";
export function usePageAnchors() {
  useEffect(() => {
    function follow(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey
      )
        return;
      const anchor =
        event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        url.search !== location.search ||
        !url.hash
      )
        return;
      let id;
      try {
        id = decodeURIComponent(url.hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      const oldURL = location.href;
      if (url.hash !== location.hash) {
        history.pushState(history.state, "", url);
        window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL, newURL: url.href }));
      }
      if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
      target.focus({ preventScroll: true });
      target.scrollIntoView({
        behavior:
          matchMedia("(prefers-reduced-motion: reduce)").matches || id === "main"
            ? "instant"
            : "smooth",
      });
    }
    document.addEventListener("click", follow);
    return () => document.removeEventListener("click", follow);
  }, []);
}
