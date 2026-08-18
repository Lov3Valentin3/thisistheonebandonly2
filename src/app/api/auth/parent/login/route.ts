import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { parents } from "@/db/schema";
import { createSession } from "@/lib/auth";
import { verifySecret } from "@/lib/crypto";
import { ensureSeeded } from "@/lib/seed";
export async function POST(request: Request) {
  await ensureSeeded();
  const body = (await request.json()) as { email?: string; password?: string };
  const email = (body.email || "").trim().toLowerCase();
  const [parent] = await db.select().from(parents).where(eq(parents.email, email)).limit(1);
  if (!parent || !verifySecret(body.password || "", parent.passwordHash)) {
    return NextResponse.json({ error: "Those parent keys did not match." }, { status: 401 });
  }
  await createSession({ role: "parent", parentId: parent.id });
  return NextResponse.json({ ok: true });
}