"use client";

import { useEffect, useState, useCallback } from "react";
import { SoundService } from "@/services/settings/SoundService";

export function useSound() {
  const [muted, setMuted] = useState<boolean>(() => SoundService.isMuted());

  useEffect(() => {
    setMuted(SoundService.isMuted());
    return SoundService.onChange(setMuted);
  }, []);

  const toggle = useCallback(() => {
    SoundService.setMuted(!SoundService.isMuted());
  }, []);

  const set = useCallback((v: boolean) => SoundService.setMuted(v), []);

  return { muted, toggle, set };
}
