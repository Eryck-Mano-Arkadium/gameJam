import { SoundService } from "@/services/settings/SoundService";

export class AudioService {
  private ctx?: AudioContext;
  private defaultVolumes: Record<string, number> = {
    tick: 1.0,
    correct: 1.0,
    wrong: 1.0,
    timer: 0.9,
  };

  private ensureCtx() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AC = (window.AudioContext || (window as any).webkitAudioContext) as
        | typeof AudioContext
        | undefined;
      if (!AC) return;
      this.ctx = new AC();
    }
  }

  private async resumeIfSuspended() {
    if (!this.ctx) return;
    // On Safari/Chrome with autoplay policies the context may be suspended until a user gesture.
    if (this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch {}
    }
  }

  async playTick() {
    if (typeof window === "undefined") return;
    try {
      this.ensureCtx();
      const ctx = this.ctx!;
      await this.resumeIfSuspended();

      const o = ctx.createOscillator();
      const g = ctx.createGain();

      o.type = "square";
      o.frequency.value = 880;

      // Short envelope
      const t0 = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.2, t0 + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);

      o.connect(g).connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + 0.13);
    } catch {
      /* ignore */
    }
  }

  private resolveUrl(relativePath: string): string {
    try {
      if (typeof window !== "undefined") {
        return new URL(relativePath.replace(/^\//, ""), document.baseURI).toString();
      }
      return relativePath.replace(/^\//, "");
    } catch {
      return relativePath.replace(/^\//, "");
    }
  }

  async playFile(relativePath: string, volumeKey: keyof AudioService["defaultVolumes"] | string = "tick") {
    if (typeof window === "undefined") return;
    if (SoundService.isMuted()) return;
    try {
      const url = this.resolveUrl(relativePath);
      const el = new Audio(url);
      const vol = this.defaultVolumes[String(volumeKey)] ?? 1.0;
      el.volume = vol;
      await el.play();
    } catch {
      /* ignore */
    }
  }

  async playCorrect() {
    await this.playFile("audio/correct.mp3", "correct");
  }

  async playWrong() {
    await this.playFile("audio/wrong.mp3", "wrong");
  }

  async playTimer() {
    // Ensure only one timer loop plays at a time
    if (typeof window === "undefined") return;
    if (SoundService.isMuted()) return;
    try {
      const url = this.resolveUrl("audio/Timer.mp3");
      const el = new Audio(url);
      el.volume = this.defaultVolumes["timer"] ?? 0.9;
      // Designed as an 11s track with per-second pings and emphasized ending
      el.play().catch(() => {});
    } catch {}
  }
}

// Export a single shared instance
export const audioService = new AudioService();
