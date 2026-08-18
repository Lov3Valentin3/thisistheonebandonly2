export function christmasTarget(now = new Date()) {
  const year = now.getMonth() === 11 && now.getDate() > 25 ? now.getFullYear() + 1 : now.getFullYear();
  return new Date(year, 11, 25, 0, 0, 0);
}
export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
export function todayQuoteIndex(total: number) {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return total === 0 ? 0 : day % total;
}
export function planLabel(plan: string) {
  if (plan === "monthly") return "Monthly Unlimited Letters";
  if (plan === "annual") return "Annual Subscription";
  if (plan === "lifetime") return "Lifetime Membership";
  return "Free workshop preview";
}
export function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}
export function safeName(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, 32);
}
export function clampAge(value: number) {
  if (Number.isNaN(value)) return 7;
  return Math.min(12, Math.max(3, Math.round(value)));
}
export function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}