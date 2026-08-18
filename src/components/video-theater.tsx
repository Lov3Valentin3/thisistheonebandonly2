"use client";
import { useState } from "react";
type Video = {
  id: number;
  title: string;
  synopsis: string;
  scene: string;
  image: string;
  duration: string;
};
export function VideoTheater({
  videos,
  elfName,
  childName,
}: {
  videos: Video[];
  elfName: string;
  childName: string;
}) {
  const [active, setActive] = useState(videos[0] || null);
  if (!active) {
    return <div className="paper mt-6 rounded-[28px] p-6">A film is still being wrapped. Write a letter to unlock the first one.</div>;
  }
  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="video-stage min-h-[320px]">
        <img src={active.image} alt={active.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-0 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#f5d37a]">{elfName} • {active.duration}</p>
          <h2 className="font-display mt-1 text-3xl">{active.title}</h2>
          <p className="font-letter mt-3 max-w-xl text-lg leading-8 text-white/90">
            {active.scene.replace(/your name/gi, childName)} Hello, {childName}!
          </p>
        </div>
      </div>
      <div className="grid gap-3">
        {videos.map((video) => (
          <button
            key={video.id}
            type="button"
            onClick={() => {
              setActive(video);
              void fetch("/api/videos/watch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ videoId: video.id }),
              });
            }}
            className={`card flex gap-3 p-3 text-left ${active.id === video.id ? "ring-2 ring-[#f5d37a]" : ""}`}
          >
            <img src={video.image} alt="" className="h-16 w-20 rounded-xl object-cover" />
            <span>
              <span className="block font-bold">{video.title}</span>
              <span className="block text-xs text-white/65">{video.synopsis}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}