"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  /** Phase start and end timestamps (ms, epoch) */
  startTs: number;
  endTs: number;
  nowFn: () => number;
  warnAt?: number; // seconds
  onWarn?: () => void;
  onAnnounce?: (text: string) => void; // for aria-live
};

export default function Countdown({
  startTs,
  endTs,
  nowFn,
  warnAt = 5,
  onWarn,
  onAnnounce,
}: Props) {
  const total = Math.max(1, endTs - startTs);
  const [now, setNow] = useState(nowFn());
  const prevWarnSecond = useRef<number | null>(null);

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
  const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));

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
            width: `${pct}%`,
            height: "100%",
            background: "#0366d6",
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
}
