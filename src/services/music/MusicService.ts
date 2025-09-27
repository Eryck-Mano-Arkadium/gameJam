export type MusicKey = "menu" | "daily" | "speed" | "infinity";

type Listener = (key: MusicKey | null) => void;

class MusicServiceImpl {
  private current: MusicKey | null = null;
  private listeners: Set<Listener> = new Set();

  get(): MusicKey | null {
    return this.current;
  }

  set(next: MusicKey | null) {
    if (this.current === next) return;
    this.current = next;
    for (const l of Array.from(this.listeners)) {
      try {
        l(this.current);
      } catch {}
    }
  }

  onChange(cb: Listener): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
}

export const MusicService = new MusicServiceImpl();


