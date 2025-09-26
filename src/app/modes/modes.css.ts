import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

/**
 * Full-screen section with the purple background PNG.
 * We add a subtle radial overlay for depth.
 */
export const screen = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background:  `url('/assets/bg.png') center / cover no-repeat`,
});

export const card = style({
    position: "relative",
});

/** Page title */
export const title = style({
  fontSize: 44,
  lineHeight: 1.2,
  fontWeight: 800,
  letterSpacing: 0.5,
  textAlign: "center",
  color: "#fff",
  margin: "60px 0 28px",
});

/** Responsive grid for the 3 mode cards */
export const grid = style({
  width: "100%",
  maxWidth: 1100,
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(260px, 1fr))",
  gap: 28,
  justifyItems: "center",

  // stack on narrow
  "@media": {
    "screen and (max-width: 980px)": {
      gridTemplateColumns: "repeat(2, minmax(260px, 1fr))",
    },
    "screen and (max-width: 660px)": {
      gridTemplateColumns: "1fr",
      gap: 20,
    },
  },
});

/** Icon wrapper (image sits centered on top) */
export const iconWrap = style({
  display: "flex",
  justifyContent: "center",
  marginBottom: 10,
});

export const iconImg = style({
  display: "block",
  height: "auto",
  userSelect: "none",
  pointerEvents: "none",
});

/** “Play” button */
export const playBtn = style({
  position: "absolute",
  bottom: 50,
  left: "50%",
  transform: "translateX(-50%)",
  transition: "transform .06s ease, filter .06s ease",
  selectors: {
    "&:hover": { filter: "brightness(1.05)" },
  },
});
