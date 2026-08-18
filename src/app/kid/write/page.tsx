import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { elves } from "@/db/schema";
import { getChildSession } from "@/lib/auth";
import { LetterComposer } from "@/components/forms";
import { Scene, TopBar } from "@/components/magic";
import { ElfAvatar } from "@/components/elf-avatar";
export const metadata = { title: "Write a Letter" };
export const dynamic = "force-dynamic";
export default async function WritePage() {
  const child = await getChildSession();
  if (!child) redirect("/kid/login");
  if (!child.elfId) redirect("/kid/choose-elf");
  const [elf] = await db.select().from(elves).where(eq(elves.id, child.elfId)).limit(1);
  if (!elf) redirect("/kid/choose-elf");
  return (
    <Scene image="/images/letter-desk.jpg">
      <TopBar
        brandHref="/kid/dashboard"
        right={
          <Link className="btn btn-ghost" href="/kid/inbox">
            Inbox
          </Link>
        }
      />
      <main className="mx-auto grid max-w-5xl gap-6 px-5 pb-16 lg:grid-cols-[1fr_280px]">
        <div className="paper rounded-[32px] p-6 sm:p-8">
          <h1 className="font-display text-3xl text-[#7a0c1a]">Write a Letter</h1>
          <p className="mt-2 text-sm text-[#5b3a24]">Tell {elf.name} anything: your day, a joke, a wish, or what you had for snack.</p>
          <div className="mt-5">
            <LetterComposer />
          </div>
        </div>
        <aside className="card h-fit p-5">
          <ElfAvatar elf={elf} size={88} />
          <h2 className="font-display mt-3 text-xl">{elf.name} is listening</h2>
          <p className="mt-2 text-sm text-white/75">{elf.greeting}</p>
        </aside>
      </main>
    </Scene>
  );
}
