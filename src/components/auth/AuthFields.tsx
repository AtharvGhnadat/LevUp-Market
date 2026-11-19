import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name"> & {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
};

export function AuthField({
  name,
  label,
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
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-alloy">
        {label}
      </label>
      <div className="relative mt-1.5">
        {Icon && (
          <Icon
            aria-hidden="true"
            size={19}
            strokeWidth={1.7}
            className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-alloy"
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
            "min-h-12 w-full rounded-md border bg-white px-3 py-2 text-base text-alloy focus:border-volt-text focus:outline-2 focus:outline-offset-1 focus:outline-volt-text",
            error ? "border-red-700" : "border-muted/80",
            Icon && "ps-12",
            password && "pe-12",
          )}
        />
        {password && (
          <button
            type="button"
            aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
            aria-controls={name}
            className="nav-icon-control absolute inset-y-0.5 end-0.5 hover:bg-mineral"
            onClick={() => setVisible((value) => !value)}
          >
            {visible ? (
              <EyeOff className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Eye className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {showHint && (
        <p id={`${name}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm font-medium text-red-800">
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
        "rounded-xs border-s-2 px-4 py-3 text-sm leading-relaxed wrap-anywhere",
        error ? "border-red-700 bg-red-50 text-red-900" : "border-volt-text bg-white text-alloy",
      )}
    >
      {children}
    </div>
  );
}
