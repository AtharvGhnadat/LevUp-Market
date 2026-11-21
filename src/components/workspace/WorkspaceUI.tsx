import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { to } from "@/lib/routes";
import type { CustomerData } from "@/workspace/use-customer-data";

export function DataView<T>({
  state,
  retry,
  children,
}: {
  state: CustomerData<T>;
  retry: () => void;
  children: (value: T) => ReactNode;
}) {
  if (state.status === "loading")
    return (
      <p role="status" className="workspace-feedback">
        Loading your records…
      </p>
    );
  if (state.status === "error")
    return (
      <div role="alert" className="workspace-feedback border-s-2 border-volt-text">
        <p>We couldn’t load these records.</p>
        <button type="button" onClick={retry} className="workspace-link">
          Try again
        </button>
      </div>
    );
  return children(state.value);
}
export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="workspace-link" href={to(href)}>
      {children}
      <ArrowRight size={15} aria-hidden="true" />
    </a>
  );
}
export function EmptyState({
  title,
  children,
  href,
  action,
}: {
  title: string;
  children: ReactNode;
  href?: string;
  action?: string;
}) {
  return (
    <div className="workspace-empty">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-[54ch] text-sm leading-relaxed text-muted">{children}</p>
      {href && action && <TextLink href={href}>{action}</TextLink>}
    </div>
  );
}
export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="workspace-section-title">{children}</h2>;
}
export function RouteRow({
  href,
  title,
  detail,
  meta,
}: {
  href: string;
  title: string;
  detail?: string;
  meta?: string;
}) {
  return (
    <a href={to(href)} className="workspace-row">
      <span className="min-w-0">
        <strong className="block font-semibold wrap-anywhere">{title}</strong>
        {detail && <span className="mt-1 block text-sm text-muted">{detail}</span>}
      </span>
      <span className="flex max-w-[40%] shrink-0 items-center gap-2 text-right text-xs text-muted">
        {meta}
        <ArrowRight size={16} aria-hidden="true" className="shrink-0" />
      </span>
    </a>
  );
}
