import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { elves, letters } from "@/db/schema";
import { getChildSession } from "@/lib/auth";
import { Scene, TopBar } from "@/components/magic";
import { formatDate } from "@/lib/utils";
export const metadata = { title: "Inbox" };
export const dynamic = "force-dynamic";
export default async function InboxPage() {
  const child = await getChildSession();
  if (!child) redirect("/kid/login");
  if (!child.elfId) redirect("/kid/choose-elf");
  const [elf] = await db.select().from(elves).where(eq(elves.id, child.elfId)).limit(1);
  const rows = await db.select().from(letters).where(eq(letters.childId, child.id)).orderBy(desc(letters.createdAt));
  const visible = rows.filter((letter) => letter.status === "sent");
  await db.update(letters).set({ readAt: new Date() }).where(eq(letters.childId, child.id));
  return (
    <Scene image="/images/santa-office.jpg">
      <TopBar
        brandHref="/kid/dashboard"
        right={
          <Link className="btn btn-red" href="/kid/write">
            Write back
          </Link>
        }
      />
      <main className="mx-auto max-w-4xl px-5 pb-16">
        <h1 className="font-display text-4xl">Inbox</h1>
        <p className="mt-2 text-white/75">Every letter between you and {elf?.name || "your elf"}.</p>
        <div className="mt-6 grid gap-4">
          {visible.length === 0 ? (
            <div className="paper rounded-[28px] p-6">No envelopes yet. Write the first one!</div>
          ) : (
            visible.map((letter) => (
              <article key={letter.id} className="envelope p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#8a5a32]">
                      {letter.author === "child" ? `From ${child.firstName}` : `From ${elf?.name}`}
                    </p>
                    <h2 className="font-display mt-1 text-xl">{letter.subject}</h2>
                  </div>
                  <span className="wax-seal" style={{ background: letter.sealColor }}>
                    ✶
                  </span>
                </div>
                <p className="font-letter mt-4 whitespace-pre-wrap text-lg leading-8">{letter.body}</p>
                <p className="mt-4 text-xs text-[#8a5a32]">{formatDate(letter.createdAt)}</p>
              </article>
            ))
          )}
        </div>
      </main>
    </Scene>
  );
}