import { Expand, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ProjectMedia } from "@/data/project-details";
import { unsplash, unsplashSrcSet } from "@/lib/image";
import { cn } from "@/lib/cn";

export function ProjectGallery({ media }: { media: ProjectMedia[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const selected = media[selectedIndex];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (viewerOpen && !dialog.open) dialog.showModal();
    if (!viewerOpen && dialog.open) dialog.close();
  }, [viewerOpen]);

  useEffect(() => {
    if (!viewerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setSelectedIndex((index) => (index + 1) % media.length);
      if (event.key === "ArrowLeft") {
        setSelectedIndex((index) => (index - 1 + media.length) % media.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [media.length, viewerOpen]);

  return (
    <div>
      <div className="relative aspect-[16/8] overflow-hidden rounded-lg border border-line bg-paper-deep shadow-card lg:aspect-[545/270]">
        <img
          key={selected.id}
          src={unsplash(selected.imageId, 1100)}
          srcSet={unsplashSrcSet(selected.imageId, [700, 1100, 1500])}
          sizes="(min-width:1280px) 545px, (min-width:768px) 55vw, 100vw"
          alt={selected.alt}
          fetchPriority={selectedIndex === 0 ? "high" : "auto"}
          style={{ objectPosition: selected.focus }}
          className="h-full w-full object-cover"
        />
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-[0.75rem] font-semibold text-ink shadow-card">
          Placeholder project media
        </span>
        <button
          type="button"
          onClick={() => setViewerOpen(true)}
          className="absolute right-4 bottom-4 inline-flex h-10 w-10 items-center justify-center rounded-sm bg-ink text-white shadow-card hover:bg-ink-soft"
          aria-label={`View ${selected.label} fullscreen`}
        >
          <Expand aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2" role="group" aria-label="Project media">
        {media.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedIndex(index)}
            aria-label={`Show ${item.label}`}
            aria-pressed={selectedIndex === index}
            className={cn(
              "aspect-[16/9] overflow-hidden rounded-sm border-2 bg-paper-deep transition-colors",
              selectedIndex === index ? "border-copper" : "border-transparent hover:border-ink/25",
            )}
          >
            <img
              src={unsplash(item.imageId, 220)}
              alt=""
              loading="lazy"
              style={{ objectPosition: item.focus }}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
      <p className="mt-2 text-[0.6875rem] leading-relaxed text-muted">
        Gallery media is representative placeholder photography until verified project assets are
        published.
      </p>

      <dialog
        ref={dialogRef}
        aria-label={`Fullscreen view: ${selected.label}`}
        onClose={() => setViewerOpen(false)}
        onClick={(event) => event.target === dialogRef.current && setViewerOpen(false)}
        className="m-auto h-[min(88dvh,900px)] w-[min(92vw,1400px)] max-w-none overflow-hidden rounded-lg border border-white/20 bg-ink p-0 shadow-panel backdrop:bg-ink/80"
      >
        <img
          src={unsplash(selected.imageId, 1800)}
          alt={selected.alt}
          style={{ objectPosition: selected.focus }}
          className="h-full w-full object-contain"
        />
        <button
          type="button"
          onClick={() => setViewerOpen(false)}
          className="absolute top-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-sm bg-white text-ink shadow-card"
          aria-label="Close fullscreen viewer"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink/80 px-4 py-2 text-xs text-white">
          {selectedIndex + 1} / {media.length} · Use left and right arrow keys
        </p>
      </dialog>
    </div>
  );
}
