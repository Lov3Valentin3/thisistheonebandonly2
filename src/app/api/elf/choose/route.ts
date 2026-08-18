import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { children, elves, letters } from "@/db/schema";
import { getChildSession } from "@/lib/auth";
export async function POST(request: Request) {
  const child = await getChildSession();
  if (!child) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const body = (await request.json()) as { elfId?: number };
  const [elf] = await db.select().from(elves).where(eq(elves.id, Number(body.elfId))).limit(1);
  if (!elf) return NextResponse.json({ error: "That elf is feeding the reindeer." }, { status: 404 });
  await db.update(children).set({ elfId: elf.id }).where(eq(children.id, child.id));
  const existing = await db.select().from(letters).where(eq(letters.childId, child.id));
  if (existing.length === 0) {
    await db.insert(letters).values({
      childId: child.id,
      elfId: elf.id,
      author: "elf",
      subject: `Hello from ${elf.name}`,
      body: `Dear ${child.firstName},\n\n${elf.greeting}\n\nI am so glad you chose me. I live at the North Pole, where ${elf.job.toLowerCase()}. I love ${elf.hobbies.toLowerCase()}, and if you ever visit my loft I will share ${elf.treat.toLowerCase()}.\n\n${elf.bio}\n\nWrite me about your day. I already put a ${child.favoriteColor} ribbon on my mailbox so I know your letters instantly.\n\nYour new friend,\n${elf.name}\n\nP.S. ${elf.funFact}`,
      status: "sent",
      sealColor: elf.accentColor,
    });
  }
  return NextResponse.json({ ok: true });
}
