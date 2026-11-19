import { useEffect, useState } from "react";
export function useUnreadReplies(owner?: string) {
  const [result, setResult] = useState<{ owner: string; unread: boolean } | null>(null);
  useEffect(() => {
    if (!owner) return;
    let active = true,
      revision = 0;
    async function refresh() {
      const version = ++revision;
      try {
        const { hasUnreadReplies } = await import("@/workspace/repository");
        const unread = await hasUnreadReplies(owner!);
        if (active && version === revision) setResult({ owner: owner!, unread });
      } catch {
        /* The inbox still opens when read status is unavailable. */
      }
    }
    void refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("levup:inbox-changed", refresh);
    return () => {
      active = false;
      window.removeEventListener("focus", refresh);
      window.removeEventListener("levup:inbox-changed", refresh);
    };
  }, [owner]);
  return result?.owner === owner && result?.unread === true;
}
