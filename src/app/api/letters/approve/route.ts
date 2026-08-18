import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { letters, notifications, parents } from "@/db/schema";
import { getParentSession } from "@/lib/auth";
export async function POST(request: Request) {
  const parent = await getParentSession();
  if (!parent) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const body = (await request.json()) as { id?: number; body?: string; action?: "approve" | "rewrite" };
  if (!body.id) return NextResponse.json({ error: "Missing letter." }, { status: 400 });
  const [letter] = await db.select().from(letters).where(eq(letters.id, body.id)).limit(1);
  if (!letter) return NextResponse.json({ error: "Letter not found." }, { status: 404 });
  const nextBody = body.body?.trim() || letter.body;
  await db
    .update(letters)
    .set({
      body: nextBody,
      author: "elf",
      status: "sent",
    })
    .where(eq(letters.id, body.id));
  await db.insert(notifications).values({
    parentId: parent.id,
    title: "Letter sent to the workshop mailbox",
    body: "Your child can now open the reply.",
    kind: "letter",
    href: "/parent/dashboard#letters",
  });
  void parents;
  return NextResponse.json({ ok: true });
}