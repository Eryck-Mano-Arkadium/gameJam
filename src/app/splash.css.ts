import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const splashRoot = style({
  // full-screen clickable area
  minHeight: "100%",
  width: "100%",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",

  // background image
  backgroundImage: 'url("/assets/Intro Screen.png")',
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",

  // subtle darken for readability if you add overlay text later
  position: "relative",
});

export const content = style({
  position: "relative",
  zIndex: 1,
  textAlign: "center",
  padding: vars.space["12"],
  borderRadius: vars.radius.md,
});
