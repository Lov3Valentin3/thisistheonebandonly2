import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { parents, subscriptions } from "@/db/schema";
import { getParentSession } from "@/lib/auth";
import { ADDONS, PLANS } from "@/lib/catalog";
export async function POST(request: Request) {
  const parent = await getParentSession();
  if (!parent) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const body = (await request.json()) as { plan?: string; addons?: string[] };
  const plan = PLANS.find((item) => item.id === body.plan);
  if (!plan) return NextResponse.json({ error: "Choose a plan." }, { status: 400 });
  const addons = (body.addons || []).filter((id) => ADDONS.some((item) => item.id === id));
  const extra = addons.reduce((sum, id) => sum + (ADDONS.find((item) => item.id === id)?.cents || 0), 0);
  const renews = new Date();
  if (plan.id === "monthly") renews.setMonth(renews.getMonth() + 1);
  else if (plan.id === "annual") renews.setFullYear(renews.getFullYear() + 1);
  else renews.setFullYear(renews.getFullYear() + 50);
  await db.insert(subscriptions).values({
    parentId: parent.id,
    plan: plan.id,
    status: "active",
    amountCents: plan.cents + extra,
    addons,
  });
  await db
    .update(parents)
    .set({
      plan: plan.id,
      planStatus: "active",
      planRenewsAt: renews,
    })
    .where(eq(parents.id, parent.id));
  return NextResponse.json({ ok: true });
}
