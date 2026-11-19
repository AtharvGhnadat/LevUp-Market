import { useId, type ReactNode, type InputHTMLAttributes } from "react";
import { Button } from "@/components/ui/Button";
import { usePrivateForm } from "@/workspace/use-private-form";

export function SettingsForm({
  children,
  onSave,
  confirmation = "Changes saved.",
  saveLabel = "Save changes",
  allowClean = false,
}: {
  children: ReactNode;
  onSave: (values: FormData) => Promise<void>;
  confirmation?: string;
  saveLabel?: string;
  allowClean?: boolean;
}) {
  const { formRef, change, submit, pending, dirty, cancel, message, failed } = usePrivateForm(
    onSave,
    confirmation,
  );
  return (
    <form
      ref={formRef}
      onChange={change}
      onSubmit={(event) => void submit(event)}
      aria-busy={pending}
      className="settings-form"
    >
      <fieldset disabled={pending} className="min-w-0 space-y-5">
        {children}
      </fieldset>
      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-line pt-4">
        <Button variant="ink" type="submit" disabled={pending || (!dirty && !allowClean)}>
          {pending ? "Saving…" : saveLabel}
        </Button>
        <button
          type="button"
          className="workspace-link"
          disabled={pending || !dirty}
          onClick={cancel}
        >
          Cancel changes
        </button>
      </div>
      {message && (
        <p
          className={failed ? "form-error" : "form-confirmation"}
          role={failed ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </form>
  );
}
export function Field({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        {...props}
        id={id}
        className="workspace-input"
        aria-describedby={hint ? id + "-hint" : undefined}
      />
      {hint && (
        <p id={id + "-hint"} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
export function Choices({
  name,
  legend,
  options,
  selected,
}: {
  name: string;
  legend: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  selected: string[];
}) {
  return (
    <fieldset>
      <legend className="field-label">{legend}</legend>
      <div className="mt-2 grid gap-x-4 min-[360px]:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"
          >
            <input
              type="checkbox"
              name={name}
              value={option.value}
              defaultChecked={selected.includes(option.value)}
              className="size-4 shrink-0 accent-alloy"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
