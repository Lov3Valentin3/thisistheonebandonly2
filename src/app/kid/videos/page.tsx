import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { childVideos, elves, videos } from "@/db/schema";
import { getChildSession } from "@/lib/auth";
import { Scene, TopBar } from "@/components/magic";
import { VideoTheater } from "@/components/video-theater";