export const workspaceLinks: ReadonlyArray<{ href: string; label: string }> = [];
export const accountLink = { href: "/account", label: "Account settings" };

export function accountName(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "Customer";
}
export function initials(name: string) {
  const words = name.trim().split(/\s+/u);
  return [words[0], words.length > 1 ? words[words.length - 1] : ""]
    .map((word) => Array.from(word)[0] ?? "")
    .join("")
    .toLocaleUpperCase();
}
