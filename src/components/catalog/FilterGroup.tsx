import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export function FilterGroup({
  title,
  count = 0,
  children,
  defaultOpen = true,
}: {
  title: string;
  count?: number;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group border-b border-line py-4" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-display text-[0.875rem] font-bold text-ink [&::-webkit-details-marker]:hidden">
        <span>
          {title}
          {count > 0 && (
            <span className="ml-2 inline-flex min-w-5 justify-center rounded-full bg-copper-tint px-1.5 py-0.5 text-[0.6875rem] text-copper-ink">
              {count}
            </span>
          )}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="h-4 w-4 text-muted transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="pt-3">{children}</div>
    </details>
  );
}

export function CheckboxOptions({
  name,
  options,
  selected,
  onToggle,
}: {
  name: string;
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <ul className="space-y-2.5">
      {options.map((option) => (
        <li key={option.value}>
          <label className="group/option flex min-h-6 cursor-pointer items-start gap-2.5 text-[0.8125rem] leading-5 text-muted hover:text-ink">
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={selected.includes(option.value)}
              onChange={() => onToggle(option.value)}
              className="mt-0.5 h-4 w-4 shrink-0 appearance-none rounded-xs border border-ink/25 bg-white checked:border-copper-action checked:bg-copper-action checked:bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22m4%208%202.5%202.5L12%205%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%222%22/%3E%3C/svg%3E')] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
            />
            <span>{option.label}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
