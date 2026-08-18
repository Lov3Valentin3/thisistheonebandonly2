"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ElfAvatar } from "@/components/elf-avatar";
type ElfCard = {
  id: number;
  name: string;
  title: string;
  bio: string;
  personality: string;
  hobbies: string;
  job: string;
  treat: string;
  funFact: string;
  hatColor: string;
  tunicColor: string;
  hairColor: string;
  skin: string;
  eyes: string;
  accessory: string;
  photo: string | null;
};
export function ElfChooser({ boys, girls }: { boys: ElfCard[]; girls: ElfCard[] }) {
  const [picked, setPicked] = useState<ElfCard | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function choose() {
    if (!picked) return;
    setBusy(true);
    await fetch("/api/elf/choose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ elfId: picked.id }),
    });
    router.push("/kid/dashboard");
    router.refresh();
  }
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-8">
        <section>
          <h2 className="font-display text-2xl text-[#f5d37a]">Boy elves</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {boys.map((elf) => (
              <button
                key={elf.id}
                type="button"
                onClick={() => setPicked(elf)}
                className={`card p-3 text-left ${picked?.id === elf.id ? "ring-2 ring-[#f5d37a]" : ""}`}
              >
                <ElfAvatar elf={elf} size={72} />
                <div className="mt-2 font-bold">{elf.name}</div>
                <div className="text-[11px] text-white/60">{elf.title}</div>
              </button>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-display text-2xl text-[#f5d37a]">Girl elves</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {girls.map((elf) => (
              <button
                key={elf.id}
                type="button"
                onClick={() => setPicked(elf)}
                className={`card p-3 text-left ${picked?.id === elf.id ? "ring-2 ring-[#f5d37a]" : ""}`}
              >
                <ElfAvatar elf={elf} size={72} />
                <div className="mt-2 font-bold">{elf.name}</div>
                <div className="text-[11px] text-white/60">{elf.title}</div>
              </button>
            ))}
          </div>
        </section>
      </div>
      <aside className="paper h-fit rounded-[28px] p-5">
        {picked ? (
          <>
            <ElfAvatar elf={picked} size={96} />
            <h3 className="font-display mt-3 text-2xl text-[#7a0c1a]">{picked.name}</h3>
            <p className="text-sm font-bold text-[#8a5a32]">{picked.title}</p>
            <p className="mt-3 text-sm leading-6">{picked.bio}</p>
            <ul className="mt-3 space-y-1 text-sm">
              <li><strong>Personality:</strong> {picked.personality}</li>
              <li><strong>Hobbies:</strong> {picked.hobbies}</li>
              <li><strong>Workshop job:</strong> {picked.job}</li>
              <li><strong>Favorite treat:</strong> {picked.treat}</li>
              <li><strong>Fun fact:</strong> {picked.funFact}</li>
            </ul>
            <button className="btn btn-red mt-5 w-full" disabled={busy} onClick={choose} type="button">
              {busy ? "Tying the friendship ribbon..." : `Be friends with ${picked.name}`}
            </button>
          </>
        ) : (
          <p className="font-letter text-xl">Tap an elf to peek at their story.</p>
        )}
      </aside>
    </div>
  );
}