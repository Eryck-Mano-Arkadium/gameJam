export class AudioService {
  private ctx?: AudioContext;

  private ensureCtx() {
    if (typeof window === "undefined") return;
    if (!this.ctx)
      this.ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
  }

  playTick() {
    if (typeof window === "undefined") return;
    try {
      this.ensureCtx();
      const ctx = this.ctx!;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = 880; // short hi beep
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.13);
    } catch {
      /* ignore */
    }
  }
}
