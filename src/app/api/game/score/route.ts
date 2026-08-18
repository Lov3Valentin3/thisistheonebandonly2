import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { achievements, gameScores, games } from "@/db/schema";
import { getChildSession } from "@/lib/auth";
export async function POST(request: Request) {
  const child = await getChildSession();
  if (!child) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const body = (await request.json()) as { slug?: string; score?: number; stars?: number };
  const [game] = await db.select().from(games).where(eq(games.slug, body.slug || "")).limit(1);
  if (!game) return NextResponse.json({ error: "Game not found." }, { status: 404 });
  await db.insert(gameScores).values({
    childId: child.id,
    gameSlug: game.slug,
    score: Number(body.score) || 0,
    stars: Math.min(3, Math.max(1, Number(body.stars) || 1)),
  });
  const earned = await db.select().from(achievements).where(eq(achievements.childId, child.id));
  if (!earned.some((row) => row.code === game.slug)) {
    await db.insert(achievements).values({
      childId: child.id,
      code: game.slug,
      title: game.badge,
      detail: `Finished ${game.title}`,
    });
  }
  return NextResponse.json({ ok: true, badge: game.badge });
}