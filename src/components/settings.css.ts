import { style } from "@vanilla-extract/css";

export const btn = style({
  border: "none",
  background: "transparent",
  cursor: "pointer",
  position: "absolute",
  left: 20,
  top: 20,
  transition: "transform 0.3s ease",
  ":hover": {
    transform: "rotate(45deg)"
  }
});
