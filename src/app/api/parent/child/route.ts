import { NextResponse } from "next/server";
import { db } from "@/db";
import { children } from "@/db/schema";
import { getParentSession } from "@/lib/auth";
import { hashSecret, mailboxFromName } from "@/lib/crypto";
import { clampAge, safeName } from "@/lib/utils";
export async function POST(request: Request) {
  const parent = await getParentSession();
  if (!parent) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const body = (await request.json()) as {
    firstName?: string;
    age?: number;
    favoriteColor?: string;
    favoriteActivity?: string;
    pin?: string;
    birthday?: string;
  };
  const firstName = safeName(body.firstName || "");
  const pin = (body.pin || "").trim();
  if (!firstName || !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: "Add a first name and 4-digit PIN." }, { status: 400 });
  }
  const [child] = await db
    .insert(children)
    .values({
      parentId: parent.id,
      firstName,
      mailboxName: mailboxFromName(firstName),
      pinHash: hashSecret(pin),
      age: clampAge(Number(body.age)),
      favoriteColor: safeName(body.favoriteColor || "red"),
      favoriteActivity: safeName(body.favoriteActivity || "decorating"),
      birthday: body.birthday || null,
    })
    .returning();
  return NextResponse.json({ ok: true, mailboxName: child.mailboxName });
}