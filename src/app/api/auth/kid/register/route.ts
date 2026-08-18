import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { children, parents } from "@/db/schema";
import { createSession } from "@/lib/auth";
import { hashSecret, mailboxFromName } from "@/lib/crypto";
import { ensureSeeded } from "@/lib/seed";
import { clampAge, safeName } from "@/lib/utils";
export async function POST(request: Request) {
  await ensureSeeded();
  const body = (await request.json()) as {
    firstName?: string;
    age?: number;
    favoriteColor?: string;
    favoriteActivity?: string;
    pin?: string;
    inviteCode?: string;
    birthday?: string;
  };
  const firstName = safeName(body.firstName || "");
  const favoriteColor = safeName(body.favoriteColor || "");
  const favoriteActivity = safeName(body.favoriteActivity || "");
  const pin = (body.pin || "").trim();
  if (!firstName || !favoriteColor || !favoriteActivity || !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: "Add your name, favorites, and a 4-digit magic PIN." }, { status: 400 });
  }
  let parentId: number | null = null;
  if (body.inviteCode) {
    const [parent] = await db
      .select()
      .from(parents)
      .where(eq(parents.inviteCode, body.inviteCode.trim().toUpperCase()))
      .limit(1);
    parentId = parent?.id ?? null;
  }
  const mailboxName = mailboxFromName(firstName);
  const [child] = await db
    .insert(children)
    .values({
      parentId,
      firstName,
      mailboxName,
      pinHash: hashSecret(pin),
      age: clampAge(Number(body.age)),
      favoriteColor,
      favoriteActivity,
      birthday: body.birthday || null,
    })
    .returning();
  await createSession({ role: "child", childId: child.id });
  return NextResponse.json({ ok: true, mailboxName, next: "/kid/choose-elf" });
}