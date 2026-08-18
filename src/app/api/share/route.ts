import { NextResponse } from "next/server";
import { getParentSession } from "@/lib/auth";
export async function POST() {
  const parent = await getParentSession();
  if (!parent) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  return NextResponse.json({
    ok: true,
    text: "My child has a magical North Pole pen pal!",
    url: "/",
  });
}