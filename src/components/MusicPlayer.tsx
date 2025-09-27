"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MusicService, type MusicKey } from "@/services/music/MusicService";
import { SoundService } from "@/services/settings/SoundService";

type TrackMap = Partial<Record<MusicKey, string>> & { fallback?: string };

export default function MusicPlayer({ tracks }: { tracks: TrackMap }) {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState<boolean>(() => SoundService.isMuted());

  // Choose a music key based on route
  const routeKey: MusicKey = useMemo(() => {
    if (!pathname) return "menu";
    if (pathname.startsWith("/daily")) return "daily";
    if (pathname.startsWith("/speed")) return "speed";
    if (pathname.startsWith("/infinity")) return "infinity";
    return "menu";
  }, [pathname]);

  // Reflect global mute changes
  useEffect(() => {
    setMuted(SoundService.isMuted());
    return SoundService.onChange(setMuted);
  }, []);

  // Publish current key for external observers (optional)
  useEffect(() => {
    MusicService.set(routeKey);
  }, [routeKey]);

  // Swap track when key changes and manage volume
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const src = tracks[routeKey] || tracks.fallback || "";
    if (!src) {
      el.pause();
      return;
    }
    const baseMusicVolume = 0.35; // keep music under SFX
    const needsSwap = el.getAttribute("data-src") !== src;
    el.muted = muted;
    el.volume = muted ? 0 : baseMusicVolume;
    el.loop = true;
    if (needsSwap) {
      el.setAttribute("data-src", src);
      el.src = src;
      // Attempt to play; browsers may block until user gesture
      el.play().catch(() => {});
    } else {
      // Ensure playing state reflects mute
      if (!el.paused && muted) el.pause();
      if (el.paused && !muted) el.play().catch(() => {});
    }
  }, [routeKey, muted, tracks]);

  return (
    <audio ref={audioRef} aria-hidden="true" style={{ display: "none" }} />
  );
}


