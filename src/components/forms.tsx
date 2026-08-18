import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { getParentSession } from "@/lib/auth";
export async function POST() {
  const parent = await getParentSession();
  if (!parent) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  await db.update(notifications).set({ read: true }).where(eq(notifications.parentId, parent.id));
  return NextResponse.json({ ok: true });
}
