import { style } from "@vanilla-extract/css";

export const overlay = style({
  position: "absolute",
  inset: 0,
  zIndex: 9999,
  pointerEvents: "auto",
  display: "grid",
  placeItems: "center",
  height: "768px",
});

export const backdrop = style({
  position: "absolute",
  inset: 0,
  background: `url('/assets/popups/popup-bg.png') center / cover no-repeat`,
  // A subtle extra dim to guarantee contrast over any screen
  opacity: 0.95,
});

export const panel = style({
  position: "relative",
  userSelect: "none",
});

export const panelImage = style({
  width: "100%",
  height: "auto",
  display: "block",
});

export const closeBtn = style({
  position: "absolute",
  top: -14,
  right: -14,
  width: 44,
  height: 44,
  border: "none",
  background: "transparent",
  padding: 0,
  cursor: "pointer",
});

export const closeIcon = style({
  width: "70%",
  height: "70%",
  display: "block",
  background: "rgba(187, 187, 187, 0.61)",
  padding: 4,
  borderRadius: 99,
  border: "1px solid #fff",
});
