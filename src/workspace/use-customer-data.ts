import { useCallback, useEffect, useReducer, useState } from "react";

export type CustomerData<T> =
  { status: "loading" } | { status: "error" } | { status: "ready"; value: T };
export function useCustomerData<T>(owner: string, load: (owner: string) => Promise<T>) {
  const [state, setState] = useState<CustomerData<T>>({ status: "loading" });
  const [revision, reload] = useReducer((n: number) => n + 1, 0);
  useEffect(() => {
    let active = true;
    load(owner).then(
      (value) => {
        if (active) setState({ status: "ready", value });
      },
      () => {
        if (active) setState({ status: "error" });
      },
    );
    return () => {
      active = false;
    };
  }, [owner, load, revision]);
  const retry = useCallback(() => {
    setState({ status: "loading" });
    reload();
  }, []);
  return { state, retry };
}
