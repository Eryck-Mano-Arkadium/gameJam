import { style, globalStyle } from "@vanilla-extract/css";

/** Outer wrapper that centers the bar and provides bottom spacing */
export const root = style({
  width: "100%",
  maxWidth: 980,
  margin: "18px auto 0",
  position: "relative",
});

/** Purple track with glossy bevel + soft drop shadow */
export const track = style({
  position: "relative",
  height: 28,
  borderRadius: 14,
  overflow: "hidden",
  // base purple gradient
  background: "linear-gradient(180deg, #B387FF 0%, #8A5BEE 100%)",
  border: "2px solid rgba(255,255,255,.25)",
  boxShadow: `
    0 10px 0 rgba(0,0,0,.18),          /* thick shadow under pill */
    inset 0 2px 0 rgba(255,255,255,.4) /* top inner shine */
  `,
});

/** Orange fill; width is set inline by the component */
export const fill = style({
  position: "relative",
  height: "100%",
  width: "0%",
  borderRadius: 12,
  background: "linear-gradient(180deg, #FFC64C 0%, #F3A81D 95%)",
  transition: "width .14s linear",
  // faint inner bevel for the orange
  boxShadow: "inset 0 2px 0 rgba(255,255,255,.55)",
});

/** A slim white highlight line at the very top of the orange fill */
globalStyle(`${fill}::after`, {
  content: '""',
  position: "absolute",
  left: 8,
  right: 8,
  top: 2,
  height: 2,
  borderRadius: 2,
  background: "rgba(255,255,255,.65)",
  pointerEvents: "none",
});

/** Optional tiny notch at the right edge of the orange */
export const cap = style({
  position: "absolute",
  top: 3,
  right: 6,
  width: 10,
  height: "calc(100% - 6px)",
  borderRadius: 8,
  background:
    "linear-gradient(180deg, rgba(255,255,255,.5), rgba(255,255,255,0))",
  opacity: 0.5,
  pointerEvents: "none",
});

/** Keep the numeric time for screen readers, hide visually in the pill variant */
export const srOnly = style({
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
});
