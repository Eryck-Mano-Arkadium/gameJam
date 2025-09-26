import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";

globalStyle("html,body,#__next,main", {
  width: "1366px !important",
  height: "768px !important",
});

globalStyle("body", {
  margin: 0,
  position: "relative",
  color: vars.color.text,
  fontFamily:
    "system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji",
});

globalStyle(":focus-visible", {
  outline: `3px solid ${vars.color.focus}`,
  outlineOffset: "2px",
});
