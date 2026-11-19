import { useEffect, useRef, useState, type FormEvent } from "react";

export function usePrivateForm(onSave: (values: FormData) => Promise<void>, confirmation: string) {
  const formRef = useRef<HTMLFormElement>(null);
  const baseline = useRef("");
  const busy = useRef(false);
  const [dirty, setDirty] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const snapshot = (form: HTMLFormElement) => JSON.stringify(Array.from(new FormData(form)));
  useEffect(() => {
    if (formRef.current) baseline.current = snapshot(formRef.current);
  }, []);
  useEffect(() => {
    if (!dirty) return;
    function beforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);
  function change() {
    if (formRef.current) setDirty(snapshot(formRef.current) !== baseline.current);
    setMessage("");
  }
  function cancel() {
    formRef.current?.reset();
    setDirty(false);
    setFailed(false);
    setMessage("Changes discarded.");
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget,
      values = new FormData(form),
      submitted = snapshot(form);
    busy.current = true;
    setPending(true);
    setMessage("");
    setFailed(false);
    try {
      await onSave(values);
      for (const control of Array.from(form.elements)) {
        if (control instanceof HTMLInputElement) {
          if (control.type === "checkbox" || control.type === "radio")
            control.defaultChecked = control.checked;
          else control.defaultValue = control.value;
        }
        if (control instanceof HTMLSelectElement)
          for (const option of control.options) option.defaultSelected = option.selected;
        if (control instanceof HTMLTextAreaElement) control.defaultValue = control.value;
      }
      baseline.current = submitted;
      setDirty(false);
      setMessage(confirmation);
    } catch {
      setFailed(true);
      setMessage(
        "We couldn’t save your changes. Your entries are still here. Check the fields and try again.",
      );
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return { formRef, dirty, pending, message, failed, change, cancel, submit };
}
