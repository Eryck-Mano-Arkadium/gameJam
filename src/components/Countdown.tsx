"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as css from "./countdown.css";

type Props = {
  /** Phase start and end timestamps (ms, epoch) */
  startTs: number;
  endTs: number;
  nowFn: () => number;
  warnAt?: number; // seconds
  onWarn?: () => void;
  onAnnounce?: (text: string) => void; // aria-live

  /**
   * Visual style of the component.
   * - "default": numeric + small bar (back-compat)
   * - "timebar": glossy pill bar like the mock (numeric is sr-only)
   */
  variant?: "default" | "timebar";

  /**
   * What the orange fill represents:
   *  - "elapsed" (default): grows as time progresses
   *  - "remaining": shrinks as time passes (matches your mock)
   */
  fillMode?: "elapsed" | "remaining";
};

export default function Countdown({
  startTs,
  endTs,
  nowFn,
  warnAt = 5,
  onWarn,
  onAnnounce,
  variant = "default",
  fillMode = "elapsed",
}: Props) {
  const total = Math.max(1, endTs - startTs);
  const [now, setNow] = useState(nowFn());
  const prevWarnSecond = useRef<number | null>(null);

  // tick ~10 times per second for a smooth bar
  useEffect(() => {
    const id = setInterval(() => setNow(nowFn()), 100);
    return () => clearInterval(id);
  }, [nowFn, startTs, endTs]);

  const remainingMs = Math.max(0, endTs - now);
  const seconds = Math.ceil(remainingMs / 1000);

  // warn/beep during last N seconds
  useEffect(() => {
    if (
      seconds > 0 &&
      seconds <= warnAt &&
      prevWarnSecond.current !== seconds
    ) {
      prevWarnSecond.current = seconds;
      onWarn?.();
      onAnnounce?.(`Only ${seconds} seconds left.`);
    }
  }, [seconds, warnAt, onWarn, onAnnounce]);

  const elapsed = Math.min(total, Math.max(0, now - startTs));
  const elapsedPct = Math.min(100, Math.max(0, (elapsed / total) * 100));
  const remainingPct = Math.min(100, Math.max(0, (remainingMs / total) * 100));

  const widthPct = fillMode === "remaining" ? remainingPct : elapsedPct;

  // --- Render --------------------------------------------------------------
  if (variant === "timebar") {
    return (
      <div className={css.root} aria-live="off">
        {/* Keep timer accessible but not visible */}
        <div className={css.srOnly} role="timer" aria-atomic="true">
          {seconds}s
        </div>
        <div className={css.track} aria-hidden="true">
          <div className={css.fill} style={{ width: `${widthPct}%` }}>
            <span className={css.cap} />
          </div>
        </div>
      </div>
    );
  }

  // Fallback/default minimal look (previous behavior)
  return (
    <div aria-live="off">
      <div role="timer" aria-atomic="true">
        {seconds}s
      </div>
      <div
        style={{ height: 8, background: "#eee", borderRadius: 4, marginTop: 6 }}
      >
        <div
          style={{
            width: `${elapsedPct}%`,
            height: "100%",
            background: "#0366d6",
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
}
