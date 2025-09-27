import { style } from "@vanilla-extract/css";

export const card = style({
  display: "flex",
  width: "100%",
  height: "380px",
  maxHeight: "380px",
  justifyContent: "center",
  alignItems: "center",
});

export const questionSection = style({
  display: "flex",
  flexDirection: "column",
  background: `url('/assets/Question_Box.png') center / 100% 100% no-repeat`,
  width: "550px",
  height: "100%",
});

export const questionText = style({
  fontSize: "40px",
  fontWeight: "600",
  color: "#ffff",
  padding: "60px 40px",
});

export const alternativesSection = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

export const input = style({
  opacity: 0,
  pointerEvents: "none",
  width: 0,
  height: 0,
});

export const inputWrapper = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const button = style({
  background: "url('/assets/Question_Box.png') center no-repeat",
  boxShadow:
    "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
  borderRadius: "22px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "400px",
  height: "80px",
  fontSize: "34px",
  fontWeight: "600",
  color: "#ffff",
  marginBottom: "10px",
  selectors: {
    "&:hover": {
      filter: "brightness(1.05)",
    },
  },
});
