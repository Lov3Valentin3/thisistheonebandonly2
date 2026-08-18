import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { elves } from "@/db/schema";
import { getChildSession } from "@/lib/auth";
import { Scene, TopBar } from "@/components/magic";
import { ElfChooser } from "@/components/elf-chooser";
export const metadata = { title: "Choose Your Elf Friend" };
export const dynamic = "force-dynamic";
export default async function ChooseElfPage() {
  const child = await getChildSession();
  if (!child) redirect("/kid/login");
  const friends = await db.select().from(elves).where(eq(elves.active, true));
  const boys = friends.filter((elf) => elf.gender === "boy");
  const girls = friends.filter((elf) => elf.gender === "girl");
  return (
    <Scene image="/images/workshop.jpg">
      <TopBar
        brandHref="/kid/dashboard"
        right={
          <form action="/api/auth/kid/logout" method="post">
            <button className="btn btn-ghost" type="submit">
              Sign out
            </button>
          </form>
        }
      />
      <main className="mx-auto max-w-6xl px-5 pb-16">
        <p className="text-xs uppercase tracking-[0.22em] text-[#f5d37a]">Choose carefully... or by giggle</p>
        <h1 className="font-display mt-2 max-w-2xl text-4xl text-white">Choose your elf friend</h1>
        <p className="mt-3 max-w-xl text-white/75">
          Hi {child.firstName}! Twenty friends live in the workshop. Read a little about them, then pick the one who feels like yours.
        </p>
        <ElfChooser boys={boys} girls={girls} />
      </main>
    </Scene>
  );
}