import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { childVideos } from "@/db/schema";
import { getChildSession } from "@/lib/auth";
export async function POST(request: Request) {
  const child = await getChildSession();
  if (!child) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const body = (await request.json()) as { videoId?: number };
  await db
    .update(childVideos)
    .set({ watchedAt: new Date() })
    .where(and(eq(childVideos.childId, child.id), eq(childVideos.videoId, Number(body.videoId))));
  return NextResponse.json({ ok: true });
}
