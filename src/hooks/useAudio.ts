"use client";
import { AudioService } from "@/services/audio/AudioService";
const service = new AudioService();

export function useAudio() {
  return {
    tick: () => service.playTick(),
  };
}
