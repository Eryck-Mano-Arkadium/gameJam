import { style } from "@vanilla-extract/css";

export const fab = style({
  position: "absolute",
  left: "max(16px, env(safe-area-inset-left))",
  bottom: "max(16px, env(safe-area-inset-bottom))",
  width: 56,
  height: 56,
  borderRadius: 9999,
  background: "linear-gradient(180deg,#7C4DFF 0%, #4B2ED6 100%)",
  boxShadow: "0 10px 20px rgba(0,0,0,.25)",
  display: "grid",
  placeItems: "center",
  zIndex: 60,
  textDecoration: "none",
  outline: "none",
  transition: "transform .15s ease, filter .15s ease, box-shadow .15s ease",
  selectors: {
    "&:hover": { transform: "translateY(-1px)", filter: "brightness(1.05)" },
    "&:active": { transform: "translateY(0)", filter: "brightness(.95)" },
    "&:focus-visible": {
      boxShadow:
        "0 0 0 3px #fff, 0 0 0 6px rgba(92,74,240,.55), 0 10px 20px rgba(0,0,0,.25)",
    },
  },
});

export const icon = style({
  width: 28,
  height: 28,
  fill: "#fff",
  marginLeft: -6,
});
