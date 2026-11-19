import { useRef, useState, type FormEvent } from "react";

export type AuthValues = Record<string, string>;
export type AuthFieldErrors = Record<string, string | undefined>;

export function useAuthForm(
  validate: (values: AuthValues) => AuthFieldErrors,
  submit: (values: AuthValues) => Promise<void>,
) {
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(
      Array.from(new FormData(form), ([key, value]) => [key, String(value)]),
    );
    const nextErrors = validate(values);
    setErrors(nextErrors);
    const missing = Object.keys(nextErrors).find((name) => nextErrors[name]);
    if (missing) {
      const field = form.elements.namedItem(missing);
      if (field instanceof HTMLElement) requestAnimationFrame(() => field.focus());
      return;
    }

    inFlight.current = true;
    setPending(true);
    try {
      await submit(values);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return { errors, pending, onSubmit };
}
