import { BaseClockService } from "./ClockService";

// Client-only epoch; no offset.
export class ClockServiceTier1 extends BaseClockService {
  constructor() {
    super();
  }
}
