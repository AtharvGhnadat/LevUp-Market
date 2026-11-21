import { ArrowLeft } from "lucide-react";
import { WorkspacePreview } from "./WorkspacePreview";
import "./credentials.css";
import { useEffect, useRef, type ReactNode } from "react";
import { to } from "@/lib/routes";

type Props = {
  title: string;
  description: string;
  children: ReactNode;
} & (
  | { mode: "login" | "signup"; guide?: never }
  | { mode?: undefined; guide: { title: string; description: string } }
);

export function AuthLayout({ title, description, guide, children, mode }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  const previousTitle = useRef(title);
  useEffect(() => {
    const saved = document.title;
    document.title = `${title} · LevUp Projects`;
    if (previousTitle.current !== title) heading.current?.focus();
    previousTitle.current = title;
    return () => {
      document.title = saved;
    };
  }, [title]);
  const feature = Boolean(mode);

  return (
    <div className="auth-viewport bg-mineral">
      <section
        aria-labelledby="auth-title"
        className={
          feature
            ? "credential-stage"
            : "auth-spread auth-service flex min-h-[calc(100dvh-4.5rem)] w-full items-center justify-center px-4 py-6"
        }
      >
        <div className={feature ? "credential-columns" : "contents"}>
          <div className={feature ? "credential-card" : "auth-form-panel customer-enter"}>
            {!feature && (
              <a
                href={to("/projects")}
                className="workspace-back mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-alloy"
              >
                <ArrowLeft size={14} aria-hidden="true" />
                Project catalog
              </a>
            )}
            <h1
              ref={heading}
              id="auth-title"
              tabIndex={-1}
              className={feature ? "auth-card-title" : "auth-heading"}
            >
              {title}
            </h1>
            <p
              className={
                feature
                  ? "auth-card-intro"
                  : "mt-1 mb-4 max-w-[45ch] text-xs leading-relaxed text-muted sm:text-sm"
              }
            >
              {description}
            </p>
            {children}
          </div>
          {feature ? (
            <aside className="credential-story">
              <h2>
                {mode === "signup" ? (
                  <>
                    A workspace for
                    <br />
                    your next build.
                  </>
                ) : (
                  <>
                    Your work, ready
                    <br />
                    when you are.
                  </>
                )}
              </h2>
              <p>
                {mode === "signup"
                  ? "Keep your engineering projects, files and custom builds together."
                  : "Access purchased projects, follow custom builds, and manage your account."}
              </p>
              <WorkspacePreview />
            </aside>
          ) : (
            guide && (
              <aside className="auth-guidance mt-4 border-t border-alloy/15 pt-3">
                <h2 className="font-display text-sm font-semibold sm:text-base">{guide.title}</h2>
                <p className="mt-1 max-w-[38ch] text-xs leading-relaxed text-muted">
                  {guide.description}
                </p>
              </aside>
            )
          )}
        </div>
      </section>
    </div>
  );
}
