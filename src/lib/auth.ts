import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { children, parents, sessions, admins } from "@/db/schema";
import { randomToken, sha256 } from "@/lib/crypto";
const DAY = 1000 * 60 * 60 * 24;
export type Role = "parent" | "child" | "admin";
export async function createSession(input: {
  role: Role;
  parentId?: number;
  childId?: number;
  days?: number;
}) {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + (input.days ?? 30) * DAY);
  await db.insert(sessions).values({
    tokenHash: sha256(token),
    role: input.role,
    parentId: input.parentId,
    childId: input.childId,
    expiresAt,
  });
  const store = await cookies();
  store.set(cookieName(input.role), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return token;
}
export async function clearSession(role: Role) {
  const store = await cookies();
  const token = store.get(cookieName(role))?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.tokenHash, sha256(token)));
  }
  store.delete(cookieName(role));
}
export async function getParentSession() {
  const session = await readSession("parent");
  if (!session?.parentId) return null;
  const [parent] = await db.select().from(parents).where(eq(parents.id, session.parentId)).limit(1);
  return parent ?? null;
}
export async function getChildSession() {
  const session = await readSession("child");
  if (!session?.childId) return null;
  const [child] = await db.select().from(children).where(eq(children.id, session.childId)).limit(1);
  return child ?? null;
}
export async function getAdminSession() {
  const session = await readSession("admin");
  if (!session) return null;
  const [admin] = await db.select().from(admins).limit(1);
  return admin ?? null;
}
async function readSession(role: Role) {
  const store = await cookies();
  const token = store.get(cookieName(role))?.value;
  if (!token) return null;
  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.tokenHash, sha256(token)), eq(sessions.role, role), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return session ?? null;
}
function cookieName(role: Role) {
  if (role === "parent") return "np_parent";
  if (role === "child") return "np_kid";
  return "np_admin";
}
