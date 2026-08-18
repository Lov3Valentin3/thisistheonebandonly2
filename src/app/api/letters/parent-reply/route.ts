import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { children, elves, letters, notifications } from "@/db/schema";
import { getParentSession } from "@/lib/auth";
export async function POST(request: Request) {
  const parent = await getParentSession();
  if (!parent) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const body = (await request.json()) as { childId?: number; text?: string };
  const [child] = await db.select().from(children).where(eq(children.id, Number(body.childId))).limit(1);
  if (!child || child.parentId !== parent.id || !child.elfId) {
    return NextResponse.json({ error: "Child not found." }, { status: 404 });
  }
  const [elf] = await db.select().from(elves).where(eq(elves.id, child.elfId)).limit(1);
  if (!elf) return NextResponse.json({ error: "Elf missing." }, { status: 404 });
  const text = (body.text || "").trim();
  if (text.length < 3) return NextResponse.json({ error: "Write a reply first." }, { status: 400 });
  await db.insert(letters).values({
    childId: child.id,
    elfId: elf.id,
    author: "elf",
    subject: `A letter from ${elf.name}`,
    body: text,
    status: "sent",
    sealColor: elf.accentColor,
  });
  await db.insert(notifications).values({
    parentId: parent.id,
    title: `${elf.name} delivered your words`,
    body: `${child.firstName} has a new letter.`,
    kind: "letter",
    href: "/parent/dashboard#letters",
  });
  return NextResponse.json({ ok: true });
}