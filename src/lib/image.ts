/** Build a sized Unsplash URL so each slot downloads only what it renders. */
export function unsplash(id: string, width: number): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=75`;
}

export function unsplashSrcSet(id: string, widths: number[]): string {
  return widths.map((w) => `${unsplash(id, w)} ${w}w`).join(", ");
}
