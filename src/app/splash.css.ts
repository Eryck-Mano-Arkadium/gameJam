import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const splashRoot = style({
  // full-screen clickable area
  minHeight: "100vh",
  width: "100%",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",

  // background image
  backgroundImage: 'url("/assets/1_Intro Screen.png")',
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",

  // subtle darken for readability if you add overlay text later
  position: "relative",
});

export const overlay = style({
  position: "absolute",
  inset: 0,
  background: vars.color.overlay,
});

export const content = style({
  position: "relative",
  zIndex: 1,
  textAlign: "center",
  padding: vars.space["12"],
  borderRadius: vars.radius.md,
});
