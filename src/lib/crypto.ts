import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
const KEYLEN = 64;
export function hashSecret(secret: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(secret, salt, KEYLEN).toString("hex");
  return `${salt}:${derived}`;
}
export function verifySecret(secret: string, stored: string) {
  const [salt, derived] = stored.split(":");
  if (!salt || !derived) return false;
  const attempt = scryptSync(secret, salt, KEYLEN);
  const actual = Buffer.from(derived, "hex");
  if (attempt.length !== actual.length) return false;
  return timingSafeEqual(attempt, actual);
}
export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
export function randomToken() {
  return randomBytes(32).toString("hex");
}
export function randomCode(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}
export function mailboxFromName(firstName: string) {
  const clean = firstName.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 12) || "friend";
  return `${clean}${Math.floor(100 + Math.random() * 900)}`;
}
