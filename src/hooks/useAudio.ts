"use client";

import { useCallback, useEffect, useState } from "react";
import { audioService } from "@/services/audio/AudioService";
import { SoundService } from "@/services/settings/SoundService";

/**
 * Exposes a stable { tick, muted } API.
 * tick() is a no-op when muted, so callers can always call it safely.
 */
export function useAudio() {
  const [muted, setMuted] = useState<boolean>(() => SoundService.isMuted());

  useEffect(() => {
    // keep local state in sync with global mute changes
    setMuted(SoundService.isMuted());
    return SoundService.onChange(setMuted);
  }, []);

  const tick = useCallback(() => {
    if (muted) return; // make it safe to call regardless of mute state
    audioService.playTick();
  }, [muted]);

  return { tick, muted };
}
