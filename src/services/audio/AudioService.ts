export class AudioService {
  private ctx?: AudioContext;

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
}

// Export a single shared instance
export const audioService = new AudioService();
