const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Prefix an app route with the deployment base path. */
export function to(path: string): string {
  return `${base}${path}`;
}

/** Current app route with the deployment base path and trailing slash removed. */
export function currentRoute(): string {
  let path = window.location.pathname;
  if (base && path.startsWith(base)) path = path.slice(base.length);
  return path.replace(/\/+$/, "") || "/";
}
