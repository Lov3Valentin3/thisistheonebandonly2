import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { children } from "@/db/schema";
import { createSession } from "@/lib/auth";
import { verifySecret } from "@/lib/crypto";
import { ensureSeeded } from "@/lib/seed";
export async function POST(request: Request) {
  await ensureSeeded();
  const body = (await request.json()) as { mailboxName?: string; pin?: string };
  const mailboxName = (body.mailboxName || "").trim().toLowerCase();
  const [child] = await db.select().from(children).where(eq(children.mailboxName, mailboxName)).limit(1);
  if (!child || !verifySecret(body.pin || "", child.pinHash)) {
    return NextResponse.json({ error: "That mailbox name or magic PIN did not open." }, { status: 401 });
  }
  await createSession({ role: "child", childId: child.id });
  return NextResponse.json({ ok: true, next: child.elfId ? "/kid/dashboard" : "/kid/choose-elf" });
}
