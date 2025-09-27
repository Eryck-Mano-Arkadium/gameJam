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
  top: 12,
  left: 340,
  width: 300,
  background: "#f252d8",
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  fontSize: 34,
  fontWeight: "bold",
  color: "#fff",
});

export const questionContainer = style({
  marginTop: "40px",
});

export const countdownContainer = style({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "40px",
  gap: "20px",
});

export const fakePlayerCount = style({
  fontSize: 20,
  fontStyle: "italic",
  color: "#fff",
});