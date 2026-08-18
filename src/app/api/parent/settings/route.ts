import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { parents } from "@/db/schema";
import { getParentSession } from "@/lib/auth";
export async function POST(request: Request) {
  const parent = await getParentSession();
  if (!parent) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const body = (await request.json()) as { responseMode?: string };
  const mode = body.responseMode;
  if (mode !== "ai" && mode !== "parent" && mode !== "both") {
    return NextResponse.json({ error: "Choose a reply style." }, { status: 400 });
  }
  await db.update(parents).set({ responseMode: mode }).where(eq(parents.id, parent.id));
  return NextResponse.json({ ok: true });
}
