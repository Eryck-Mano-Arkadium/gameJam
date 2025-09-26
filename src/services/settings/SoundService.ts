// Simple localStorage-backed mute flag with a tiny event bus.
const LS_KEY = "sound:muted";
const EVT = "sound:mute-changed";

export class SoundService {
  static isMuted(): boolean {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(LS_KEY) === "1";
    } catch {
      return false;
    }
  }

  static setMuted(next: boolean) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LS_KEY, next ? "1" : "0");
      window.dispatchEvent(new CustomEvent(EVT, { detail: next }));
    } catch {}
  }

  static onChange(fn: (muted: boolean) => void): () => void {
    const handler = (e: Event) => {
      const d = (e as CustomEvent<boolean>).detail;
      fn(typeof d === "boolean" ? d : SoundService.isMuted());
    };
    if (typeof window !== "undefined") {
      window.addEventListener(EVT, handler as EventListener);
      return () => window.removeEventListener(EVT, handler as EventListener);
    }
    return () => {};
  }
}
