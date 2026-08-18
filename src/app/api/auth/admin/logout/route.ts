import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";
export async function POST(request: Request) {
  await clearSession("child");
  return NextResponse.redirect(new URL("/", request.url), 303);
}