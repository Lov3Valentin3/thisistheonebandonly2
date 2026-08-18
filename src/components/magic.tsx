"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { christmasTarget } from "@/lib/utils";
export function Snow() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 42 }, (_, index) => ({
        id: index,
        left: `${(index * 23) % 100}%`,
        delay: `${(index % 12) * 0.45}s`,
        duration: `${9 + (index % 8)}s`,
        size: `${10 + (index % 10)}px`,
        opacity: 0.35 + (index % 5) * 0.12,
        glyph: index % 5 === 0 ? "✦" : "❄",
      })),
    [],
  );
  return (
    <div className="snow-layer" aria-hidden>
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className="flake"
          style={{
            left: flake.left,
            animationDelay: flake.delay,
            animationDuration: flake.duration,
            fontSize: flake.size,
            opacity: flake.opacity,
          }}
        >
          {flake.glyph}
        </span>
      ))}
    </div>
  );
}
export function Twinkles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        top: `${(index * 19) % 80}%`,
        delay: `${(index % 7) * 0.3}s`,
      })),
    [],
  );
  return (
    <div className="twinkle-layer" aria-hidden>
      {dots.map((dot) => (
        <span key={dot.id} className="twinkle" style={{ left: dot.left, top: dot.top, animationDelay: dot.delay }} />
      ))}
    </div>
  );
}
export function SoundChime() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!on) return;
    const ctx = new AudioContext();
    const play = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = 880;
      gain.gain.value = 0.03;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      osc.stop(ctx.currentTime + 0.42);
    };
    play();
    const id = window.setInterval(play, 18000);
    return () => {
      window.clearInterval(id);
      void ctx.close();
    };
  }, [on]);
  return (
    <button className="btn btn-ghost" type="button" onClick={() => setOn((value) => !value)} aria-pressed={on}>
      {on ? "Chimes on" : "Magical chimes"}
    </button>
  );
}
export function Countdown() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const target = christmasTarget(now);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  const cells = [
    ["Days", days],
    ["Hours", hours],
    ["Minutes", minutes],
    ["Seconds", seconds],
  ] as const;
  return (
    <div className="grid grid-cols-4 gap-2">
      {cells.map(([label, value]) => (
        <div key={label} className="rounded-2xl bg-black/30 px-2 py-3 text-center ring-1 ring-white/10">
          <div className="font-display text-2xl text-[#f5d37a]">{String(value).padStart(2, "0")}</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/60">{label}</div>
        </div>
      ))}
    </div>
  );
}
export function TopBar({
  brandHref = "/",
  right,
}: {
  brandHref?: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="relative z-10">
      <div className="garland" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href={brandHref} className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#9f1239] shadow-[0_0_20px_rgba(225,29,72,0.45)]">
            ✉
          </span>
          <span>
            <span className="font-display block text-sm tracking-wide text-[#f5d37a]">North Pole Post</span>
            <span className="text-xs text-white/70">Magical Elf Pen Pals</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">{right}</div>
      </div>
    </header>
  );
}
export function Scene({
  image,
  children,
  overlay = "bg-gradient-to-b from-black/30 via-[#07040a]/55 to-[#07040a]",
}: {
  image: string;
  children: React.ReactNode;
  overlay?: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img src={image} alt="" className="h-full w-full object-cover" />
        <div className={`absolute inset-0 ${overlay}`} />
      </div>
      <Snow />
      <Twinkles />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
export function LogoutButton({ action }: { action: string }) {
  return (
    <form action={action} method="post">
      <button className="btn btn-ghost" type="submit">
        Sign out
      </button>
    </form>
  );
}
