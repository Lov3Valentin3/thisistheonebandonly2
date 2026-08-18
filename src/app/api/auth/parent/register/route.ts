import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { parents } from "@/db/schema";
import { createSession } from "@/lib/auth";
import { hashSecret, randomCode } from "@/lib/crypto";
import { ensureSeeded } from "@/lib/seed";
import { safeName } from "@/lib/utils";
export async function POST(request: Request) {
  await ensureSeeded();
  const body = (await request.json()) as { name?: string; email?: string; password?: string };
  const name = safeName(body.name || "");
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  if (!name || !email.includes("@") || password.length < 8) {
    return NextResponse.json({ error: "Please add your name, a real email, and a password of 8+ characters." }, { status: 400 });
  }
  const [existing] = await db.select().from(parents).where(eq(parents.email, email)).limit(1);
  if (existing) {
    return NextResponse.json({ error: "That email already has a North Pole mailbox." }, { status: 400 });
  }
  const [parent] = await db
    .insert(parents)
    .values({
      name,
      email,
      passwordHash: hashSecret(password),
      inviteCode: randomCode(6),
    })
    .returning();
  await createSession({ role: "parent", parentId: parent.id });
  return NextResponse.json({ ok: true });
}