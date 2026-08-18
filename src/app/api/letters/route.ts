import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  achievements,
  certificates,
  childCertificates,
  childVideos,
  children,
  elves,
  letters,
  memories,
  notifications,
  parents,
  videos,
} from "@/db/schema";
import { getChildSession, getParentSession } from "@/lib/auth";
import { extractMemories, generateElfReply } from "@/lib/elf-reply";
export async function POST(request: Request) {
  const child = await getChildSession();
  if (!child?.elfId) {
    return NextResponse.json({ error: "Choose your elf friend first." }, { status: 401 });
  }
  const body = (await request.json()) as { subject?: string; body?: string };
  const text = (body.body || "").trim();
  if (text.length < 3) {
    return NextResponse.json({ error: "Write a little more of your letter." }, { status: 400 });
  }
  const [elf] = await db.select().from(elves).where(eq(elves.id, child.elfId)).limit(1);
  if (!elf) return NextResponse.json({ error: "Your elf is decorating a tree. Try again." }, { status: 404 });
  const parent = child.parentId
    ? (await db.select().from(parents).where(eq(parents.id, child.parentId)).limit(1))[0]
    : null;
  const mode = parent?.responseMode || "ai";
  await db.insert(letters).values({
    childId: child.id,
    elfId: elf.id,
    author: "child",
    subject: (body.subject || `A letter from ${child.firstName}`).slice(0, 80),
    body: text,
    status: "sent",
    sealColor: child.favoriteColor.toLowerCase().includes("green") ? "#15803d" : "#b11226",
  });
  for (const memory of extractMemories(text, child.firstName)) {
    await db.insert(memories).values({ childId: child.id, kind: memory.kind, content: memory.content });
  }
  if (parent) {
    await db.insert(notifications).values({
      parentId: parent.id,
      title: `${child.firstName} wrote a letter`,
      body: "A new envelope is waiting in the family mailbox.",
      kind: "letter",
      href: "/parent/dashboard#letters",
    });
  }
  const letterCount = (await db.select().from(letters).where(eq(letters.childId, child.id))).filter((row) => row.author === "child").length;
  if (letterCount === 1) {
    await unlockCertificate(child.id, "north-pole-friend");
    await unlockCertificate(child.id, "kindness");
  }
  if (letterCount === 3) await grantAchievement(child.id, "three-letters", "Three Magical Letters", "You wrote three letters to your elf.");
  if (letterCount === 5) await unlockCertificate(child.id, "best-friend");
  if (mode === "parent") {
    return NextResponse.json({ ok: true, pending: true });
  }
  const history = await db.select().from(letters).where(eq(letters.childId, child.id)).orderBy(desc(letters.createdAt));
  const known = await db.select().from(memories).where(eq(memories.childId, child.id));
  const reply = await generateElfReply({
    childName: child.firstName,
    age: child.age,
    favoriteColor: child.favoriteColor,
    favoriteActivity: child.favoriteActivity,
    wishes: child.wishes,
    birthday: child.birthday,
    memories: known.map((item) => item.content),
    previousLetters: history.slice(0, 8).reverse().map((item) => ({ author: item.author, body: item.body })),
    elfSlug: elf.slug,
    letter: text,
  });
  const status = mode === "both" ? "pending_parent" : "sent";
  await db.insert(letters).values({
    childId: child.id,
    elfId: elf.id,
    author: "elf",
    subject: `A letter from ${elf.name}`,
    body: reply,
    status,
    sealColor: elf.accentColor,
  });
  if (parent && mode === "both") {
    await db.insert(notifications).values({
      parentId: parent.id,
      title: "A workshop draft is ready",
      body: `${elf.name}'s reply is waiting for your approval.`,
      kind: "letter",
      href: "/parent/dashboard#letters",
    });
  }
  if (letterCount === 1) {
    const starterVideos = await db.select().from(videos);
    for (const video of starterVideos.filter((item) => !item.premium).slice(0, 3)) {
      await db.insert(childVideos).values({ childId: child.id, videoId: video.id });
    }
    if (parent) {
      await db.insert(notifications).values({
        parentId: parent.id,
        title: "A workshop video arrived",
        body: `${child.firstName} unlocked a hello from the North Pole.`,
        kind: "video",
        href: "/parent/dashboard",
      });
    }
  }
  return NextResponse.json({ ok: true, pending: status !== "sent" });
}
async function unlockCertificate(childId: number, slug: string) {
  const [cert] = await db.select().from(certificates).where(eq(certificates.slug, slug)).limit(1);
  if (!cert) return;
  const existing = await db.select().from(childCertificates).where(eq(childCertificates.childId, childId));
  if (existing.some((row) => row.certificateId === cert.id)) return;
  await db.insert(childCertificates).values({ childId, certificateId: cert.id });
}
async function grantAchievement(childId: number, code: string, title: string, detail: string) {
  const existing = await db.select().from(achievements).where(eq(achievements.childId, childId));
  if (existing.some((row) => row.code === code)) return;
  await db.insert(achievements).values({ childId, code, title, detail });
}
export async function GET() {
  const parent = await getParentSession();
  const child = await getChildSession();
  if (!parent && !child) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const childId = child?.id;
  if (!childId && !parent) return NextResponse.json({ letters: [] });
  const rows = childId
    ? await db.select().from(letters).where(eq(letters.childId, childId)).orderBy(desc(letters.createdAt))
    : await db.select().from(letters).orderBy(desc(letters.createdAt));
  return NextResponse.json({ letters: rows });
}
