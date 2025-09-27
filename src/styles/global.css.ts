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
    "Gothic, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji",
});

// Use Cubano for uppercase text
globalStyle("*[style*='text-transform: uppercase'], *[style*='TEXT-TRANSFORM: UPPERCASE']", {
  fontFamily: "Cubano, Gothic, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji",
});

// Use Cubano for elements with uppercase class
globalStyle(".uppercase, .caps", {
  fontFamily: "Cubano, Gothic, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji",
});

// Use Cubano for headings (which are often uppercase)
globalStyle("h1, h2, h3, h4, h5, h6", {
  fontFamily: "Cubano, Gothic, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji",
});

// Use Cubano for specific elements that contain uppercase text
globalStyle("[class*='title'], [class*='header'], [class*='label']", {
  fontFamily: "Cubano, Gothic, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji",
});

globalStyle(":focus-visible", {
  outline: `3px solid ${vars.color.focus}`,
  outlineOffset: "2px",
});
