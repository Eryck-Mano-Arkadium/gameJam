import { style } from "@vanilla-extract/css";

export const screen = style({
  display: "flex",
  height: "100%",
  flexDirection: "column",
  alignItems: "center",
  background: `url('/assets/bg.png') center / cover no-repeat`,
});

export const logo = style({});

export const container = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
});

export const score = style({
  marginLeft: "50%",
  transform: "translateX(-50%)",
});

export const scoreContainer = style({
  position: "relative",
});

export const scoreText = style({
  position: "absolute",
  width: 40,
  top: 14,
  right: 245,
  fontSize: 32,
  fontWeight: "bold",
  color: "#FFC64C",
});

export const questionText = style({
  fontSize: 34,
  fontWeight: "bold",
  color: "#fff",
  position: "absolute",
  top: 14,
  left: 160,
});

export const questionContainer = style({
  marginTop: "40px",
});
