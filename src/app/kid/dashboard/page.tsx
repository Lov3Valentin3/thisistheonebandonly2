import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { achievements, children, elves, letters, quotes } from "@/db/schema";
import { getChildSession } from "@/lib/auth";
import { Countdown, Scene, TopBar } from "@/components/magic";
import { ElfAvatar } from "@/components/elf-avatar";
import { todayQuoteIndex } from "@/lib/utils";
export const metadata = { title: "Kid Dashboard" };
export const dynamic = "force-dynamic";
export default async function KidDashboardPage() {
  const child = await getChildSession();
  if (!child) redirect("/kid/login");
  if (!child.elfId) redirect("/kid/choose-elf");
  await db.update(children).set({ lastSeenAt: new Date() }).where(eq(children.id, child.id));
  const [elf] = await db.select().from(elves).where(eq(elves.id, child.elfId)).limit(1);
  if (!elf) redirect("/kid/choose-elf");
  const inbox = await db.select().from(letters).where(eq(letters.childId, child.id)).orderBy(desc(letters.createdAt));
  const unread = inbox.filter((letter) => letter.author === "elf" && letter.status === "sent" && !letter.readAt).length;
  const badges = await db.select().from(achievements).where(eq(achievements.childId, child.id));
  const allQuotes = await db.select().from(quotes);
  const quote = allQuotes[todayQuoteIndex(allQuotes.length)]?.line || "Believe in the impossible.";
  return (
    <Scene image="/images/hero-north-pole.jpg">
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
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="paper rounded-[32px] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8a5a32]">Welcome back, {child.firstName}</p>
            <h1 className="font-display mt-2 text-4xl text-[#7a0c1a]">Your North Pole mailbox</h1>
            <p className="mt-3 max-w-xl text-[#5b3a24]">
              {elf.name} left the lantern on. Write a letter, open the inbox, or sneak into the games loft.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="btn btn-red" href="/kid/write">
                Write a Letter
              </Link>
              <Link className="btn btn-green" href="/kid/inbox">
                Inbox {unread ? `(${unread} new)` : ""}
              </Link>
            </div>
          </div>
          <aside className="card flex items-center gap-4 p-5">
            <ElfAvatar elf={elf} size={96} />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#f5d37a]">Your elf friend</p>
              <h2 className="font-display text-2xl">{elf.name}</h2>
              <p className="text-sm text-white/70">{elf.title}</p>
              <p className="mt-2 text-sm text-white/80">{elf.personality}</p>
            </div>
          </aside>
        </section>
        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["/kid/inbox", "Inbox", "Magical envelopes from your friend", "/images/letter-desk.jpg"],
            ["/kid/videos", "Videos From Your Elf", "Little films from the workshop", "/images/workshop.jpg"],
            ["/kid/certificates", "Certificates", "Printable North Pole awards", "/images/certificate-bg.jpg"],
            ["/kid/games", "Mini Games", "Play, earn badges, giggle", "/images/toy-display.jpg"],
          ].map(([href, title, copy, image]) => (
            <Link key={href} href={href} className="card overflow-hidden">
              <img src={image} alt="" className="h-28 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-display text-lg">{title}</h3>
                <p className="mt-1 text-sm text-white/70">{copy}</p>
              </div>
            </Link>
          ))}
        </section>
        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="card p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#f5d37a]">Countdown to Christmas</p>
            <div className="mt-4">
              <Countdown />
            </div>
          </div>
          <div className="paper rounded-[28px] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8a5a32]">Daily inspiration</p>
            <p className="font-script mt-3 text-4xl text-[#7a0c1a]">{quote}</p>
            {badges.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <span key={badge.id} className="rounded-full bg-[#14532d] px-3 py-1 text-xs text-white">
                    {badge.title}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#5b3a24]">Play a game or send a letter to earn your first badge.</p>
            )}
          </div>
        </section>
      </main>
    </Scene>
  );
}