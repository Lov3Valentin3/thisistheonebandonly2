import Link from "next/link";
import { Countdown, Scene, SoundChime, TopBar } from "@/components/magic";
import { ensureSeeded } from "@/lib/seed";
export const dynamic = "force-dynamic";
export default async function HomePage() {
  await ensureSeeded();
  return (
    <Scene image="/images/hero-north-pole.jpg">
      <TopBar
        right={
          <div className="hidden items-center gap-2 sm:flex">
            <SoundChime />
            <Link className="btn btn-ghost" href="/parent/login">
              Parent
            </Link>
            <Link className="btn btn-red" href="/kid/login">
              Kid Login
            </Link>
          </div>
        }
      />
      <main className="mx-auto grid max-w-6xl gap-8 px-5 pb-20 pt-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="max-w-xl">
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#f5d37a]">Letters from the North Pole</p>
          <h1 className="font-display text-4xl leading-tight text-white sm:text-6xl">
            A magical elf is waiting to be your pen pal.
          </h1>
          <p className="mt-4 max-w-md text-base text-white/80 sm:text-lg">
            Open a letter. Choose a friend. Write back all year long. The workshop lights are already twinkling for you.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link className="btn btn-gold" href="/kid/register">
              Kid Register
            </Link>
            <Link className="btn btn-red" href="/kid/login">
              Kid Login
            </Link>
            <Link className="btn btn-green" href="/parent/register">
              Parent Register
            </Link>
            <Link className="btn btn-ghost" href="/parent/login">
              Parent Login
            </Link>
          </div>
        </section>
        <article className="paper relative rounded-[32px] p-6 sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8a5a32]">Already waiting in the snow</p>
            <span className="wax-seal" aria-hidden>
              ✶
            </span>
          </div>
          <img src="/images/letter-desk.jpg" alt="A parchment letter on a North Pole desk" className="mb-5 h-36 w-full rounded-2xl object-cover" />
          <h2 className="font-script text-5xl text-[#7a0c1a]">Dear Friend,</h2>
          <div className="font-letter mt-3 space-y-3 text-lg leading-8 text-[#3b2416]">
            <p>My name is Jingle, and I live in a twinkly loft above Santa&apos;s workshop. The snow is falling sideways tonight, which means it is the perfect time to make a new friend.</p>
            <p>Would you like to be my pen pal? I can tell you about sled races, cookie emergencies, and the reindeer who steal my mittens.</p>
            <p>Write me soon. I already tied a red ribbon on an empty envelope with your name on it.</p>
          </div>
          <p className="font-script mt-6 text-4xl text-[#14532d]">Your friend, Jingle</p>
        </article>
      </main>
      <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-16 md:grid-cols-3">
        <div className="card p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#f5d37a]">Countdown</p>
          <h2 className="font-display mt-2 text-xl">Until Christmas morning</h2>
          <div className="mt-4">
            <Countdown />
          </div>
        </div>
        <div className="card overflow-hidden">
          <img src="/images/workshop.jpg" alt="Santa's workshop" className="h-36 w-full object-cover" />
          <div className="p-5">
            <h2 className="font-display text-xl">Write. Play. Celebrate.</h2>
            <p className="mt-2 text-sm text-white/70">Letters, games, certificates, and little films from the workshop — all in one cozy place.</p>
          </div>
        </div>
        <div className="card overflow-hidden">
          <img src="/images/reindeer-feed.jpg" alt="Reindeer in a snowy stable" className="h-36 w-full object-cover" />
          <div className="p-5">
            <h2 className="font-display text-xl">Safe for families</h2>
            <p className="mt-2 text-sm text-white/70">Parents keep a quiet key to the mailbox. Kids keep the wonder.</p>
          </div>
        </div>
      </section>
    </Scene>
  );
}
