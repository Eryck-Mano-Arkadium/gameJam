import { createGlobalTheme } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
  color: {
    bg: "#0a0a0a",
    text: "#ffffff",
    overlay: "rgba(0,0,0,.45)",
    focus: "#59a8ff",
  },
  space: {
    0: "0",
    2: "8px",
    3: "12px",
    4: "16px",
    6: "24px",
    12: "48px",
  },
  radius: {
    md: "12px",
  },
  z: {
    hud: "1000",
  },
});
