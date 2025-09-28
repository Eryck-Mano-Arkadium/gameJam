"use client";

import { useEffect, useState } from "react";
import * as M from "./modeIntro.css";

export type ModeKey = "daily" | "speed" | "infinity";

const IMG: Record<ModeKey, string> = {
  daily: "/assets/popups/daily-popup.png",
  speed: "/assets/popups/speed-popup.png",
  infinity: "/assets/popups/infinity-popup.png",
};

const LS_KEY = (mode: ModeKey) => `intro:seen:${mode}`;

type Props = {
  mode: ModeKey;
  /** Called only when the user clicks the close button */
  onClose?: () => void;
};

export default function ModeIntro({ mode, onClose }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem(LS_KEY(mode)) === "1";
    if (!seen) setOpen(true);
  }, [mode]);

  if (!open) return null;

  const close = () => {
    try {
      localStorage.setItem(LS_KEY(mode), "1");
    } catch {}
    setOpen(false);
    onClose?.();
  };

  return (
    <div
      className={M.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Game instructions"
    >
      {/* The dim/texture background */}
      <div className={M.backdrop} />

      {/* The centered panel image */}
      <div className={M.panel}>
        <img className={M.panelImage} src={IMG[mode]} alt="" />
        <button className={M.closeBtn} aria-label="Close" onClick={close}>
          <img
            className={M.closeIcon}
            src="/assets/popups/popup-close.svg"
            alt=""
          />
        </button>
      </div>
    </div>
  );
}
