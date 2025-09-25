import { BaseClockService } from "./ClockService";

export class ClockServiceTier2 extends BaseClockService {
  private initialized = false;

  async init(endpoint: string = "/api/time") {
    try {
      const before = Date.now();
      const res = await fetch(endpoint, { cache: "no-store" });
      const json = await res.json();
      const after = Date.now();
      const rtt = (after - before) / 2;
      const serverNow = json.now + rtt; // approx center
      this.offsetMs = serverNow - after;
      this.initialized = true;
    } catch {
      this.initialized = true; // fail open with zero offset
    }
  }

  isReady() {
    return this.initialized;
  }
}
