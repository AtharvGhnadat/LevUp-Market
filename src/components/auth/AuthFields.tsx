import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name"> & {
  name: string;
  label: string;
  labelAction?: ReactNode;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
};

export function AuthField({
  name,
  label,
  labelAction,
  error,
  hint,
  icon: Icon,
  type = "text",
  ...input
}: FieldProps) {
  const [visible, setVisible] = useState(false);
  const password = type === "password";
  const showHint = hint && hint !== error;
  const description = [showHint && `${name}-hint`, error && `${name}-error`]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="auth-field">
      <div className="flex flex-wrap items-center justify-between gap-x-3">
        <label htmlFor={name} className="block text-xs font-semibold text-alloy">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative mt-1">
        {Icon && (
          <Icon
            aria-hidden="true"
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-alloy/60"
          />
        )}
        <input
          {...input}
          id={name}
          name={name}
          type={password && visible ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={description || undefined}
          className={cn(
            "min-h-10 sm:min-h-10.5 w-full rounded-md border bg-white px-3 py-1.5 text-sm text-alloy transition-colors focus:border-volt-text focus:outline-2 focus:outline-offset-1 focus:outline-volt-text",
            error ? "border-red-700 bg-red-50/20" : "border-alloy/25 hover:border-alloy/40",
            Icon && "ps-9.5",
            password && "pe-9.5",
          )}
        />
        {password && (
          <button
            type="button"
            aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
            aria-controls={name}
            className="nav-icon-control absolute inset-y-0.5 end-0.5 size-9 hover:bg-mineral"
            onClick={() => setVisible((value) => !value)}
          >
            {visible ? (
              <EyeOff className="size-4" strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Eye className="size-4" strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {showHint && (
        <p id={`${name}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs font-medium text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}

export function AuthNotice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return (
    <div
      role={error ? "alert" : "status"}
      className={cn(
        "rounded-xs border-s-2 px-3 py-2 text-xs sm:text-sm leading-relaxed wrap-anywhere",
        error ? "border-red-700 bg-red-50 text-red-900" : "border-volt-text bg-white text-alloy",
      )}
    >
      {children}
    </div>
  );
}
