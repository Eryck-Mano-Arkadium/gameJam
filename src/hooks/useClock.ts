"use client";
import { useEffect, useRef, useState } from "react";
import { ClockService, PhaseInfo, EPOCH_MS } from "@/services/clock/types";
import { ClockServiceTier1 } from "@/services/clock/ClockServiceTier1";

const defaultClock: ClockService = new ClockServiceTier1();

export function useClock(clock: ClockService = defaultClock) {
  const serviceRef = useRef(clock);

  // deterministic initial state for SSR and first client paint
  const [info, setInfo] = useState<PhaseInfo>(
    () => serviceRef.current.phaseInfo(EPOCH_MS) // Round #0 / QUESTION
  );

  useEffect(() => {
    // jump to real time after mount
    setInfo(serviceRef.current.phaseInfo());
    const unsub = serviceRef.current.subscribe(setInfo);
    return () => unsub();
  }, []);

  return {
    now: serviceRef.current.now.bind(serviceRef.current),
    roundId: serviceRef.current.roundId.bind(serviceRef.current),
    phaseInfo: () => info,
  };
}
