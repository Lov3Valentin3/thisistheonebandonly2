import { NextResponse } from "next/server";
import { db } from "@/db";
import { elves, quotes, videos, certificates } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Workshop only." }, { status: 401 });
  const body = (await request.json()) as {
    kind?: "quote" | "video" | "certificate" | "elf";
    payload?: Record<string, string | number | boolean>;
  };
  if (body.kind === "quote" && typeof body.payload?.line === "string") {
    await db.insert(quotes).values({ line: body.payload.line, dayIndex: Number(body.payload.dayIndex || 0) });
  } else if (body.kind === "video") {
    await db.insert(videos).values({
      slug: String(body.payload?.slug || `video-${Date.now()}`),
      title: String(body.payload?.title || "New workshop film"),
      synopsis: String(body.payload?.synopsis || "A new peek at the North Pole."),
      scene: String(body.payload?.scene || "Snow sparkles around the workshop."),
      image: String(body.payload?.image || "/images/workshop.jpg"),
      duration: String(body.payload?.duration || "0:45"),
      premium: Boolean(body.payload?.premium),
    });
  } else if (body.kind === "certificate") {
    await db.insert(certificates).values({
      slug: String(body.payload?.slug || `cert-${Date.now()}`),
      title: String(body.payload?.title || "New Certificate"),
      description: String(body.payload?.description || "A magical award."),
      flourish: String(body.payload?.flourish || "With North Pole pride."),
      premium: Boolean(body.payload?.premium),
      priceCents: Number(body.payload?.priceCents || 0),
    });
  } else if (body.kind === "elf") {
    await db.insert(elves).values({
      slug: String(body.payload?.slug || `elf-${Date.now()}`),
      name: String(body.payload?.name || "New Elf"),
      gender: String(body.payload?.gender || "boy"),
      title: String(body.payload?.title || "Workshop Friend"),
      bio: String(body.payload?.bio || "A brand-new friend from the North Pole."),
      personality: String(body.payload?.personality || "Kind and curious"),
      hobbies: String(body.payload?.hobbies || "Sledding"),
      job: String(body.payload?.job || "Helps in the workshop"),
      treat: String(body.payload?.treat || "Peppermint cocoa"),
      funFact: String(body.payload?.funFact || "Loves snow."),
      greeting: String(body.payload?.greeting || "Hello, new friend!"),
      voiceNotes: String(body.payload?.voiceNotes || "Warm and playful."),
      accentColor: "#b11226",
      hatColor: "#14532d",
      tunicColor: "#9f1239",
      hairColor: "#78350f",
      skin: "#f6c7a1",
      eyes: "#3b2416",
      accessory: "bell",
      featured: false,
      active: true,
    });
  } else {
    return NextResponse.json({ error: "Unknown workshop item." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}