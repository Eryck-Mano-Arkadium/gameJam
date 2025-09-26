import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";

globalStyle("html,body,#__next", {
  height: "100%",
});

globalStyle("body", {
  margin: 0,
  background: vars.color.bg,
  color: vars.color.text,
  fontFamily:
    "system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji",
});

globalStyle(":focus-visible", {
  outline: `3px solid ${vars.color.focus}`,
  outlineOffset: "2px",
});
