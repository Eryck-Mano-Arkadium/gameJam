// src/components/questionCard.css.ts
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

export const inputWrapper = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const input = style({
  opacity: 0,
  pointerEvents: "none",
  width: 0,
  height: 0,
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
  textAlign: "center",
  width: "400px",
  height: "80px",
  fontSize: "30px",
  fontWeight: "600",
  color: "#ffff",
  marginBottom: "10px",
  paddingLeft: "10px",
  selectors: { "&:hover": { filter: "brightness(1.05)" } },
});

export const selectedFromInput = style({
  selectors: {
    [`${input}:checked + &`]: {
      background: "linear-gradient(180deg, #FFC64C 0%, #F3A81D 100%)",
      boxShadow:
        "0 8px 0 rgba(0,0,0,.18), inset 0 2px 0 rgba(255,255,255,.55), 0 0 0 3px rgba(25,211,126,.28)",
      transform: "translateY(-2px)",
      filter: "none",
    },
    [`fieldset[disabled] &`]: {
      filter: "grayscale(.25) opacity(.8)",
      cursor: "not-allowed",
    },
  },
});

/* -------- NEW: reveal mode marker + correct/wrong skins -------- */

export const revealRoot = style({}); // just a marker class on the fieldset

export const buttonCorrect = style({
  selectors: {
    // reveal state (unclicked or disabled)
    [`${revealRoot} &`]: {
      background: "linear-gradient(180deg, #19D37E 0%, #0CB25F 100%)",
      boxShadow:
        "0 8px 0 rgba(0,0,0,.18), inset 0 2px 0 rgba(255,255,255,.55), 0 0 0 3px rgba(25,211,126,.28)",
      transform: "translateY(-2px)",
      filter: "none",
    },
    // 👇 override the yellow `:checked` skin during reveal
    [`${revealRoot} ${input}:checked + &`]: {
      background: "linear-gradient(180deg, #19D37E 0%, #0CB25F 100%)",
      boxShadow:
        "0 8px 0 rgba(0,0,0,.18), inset 0 2px 0 rgba(255,255,255,.55), 0 0 0 3px rgba(25,211,126,.28)",
      transform: "translateY(-2px)",
      filter: "none",
    },
  },
});

export const buttonWrong = style({
  selectors: {
    [`${revealRoot} &`]: {
      background: "linear-gradient(180deg, #FF7A7A 0%, #E45050 100%)",
      boxShadow:
        "0 8px 0 rgba(0,0,0,.18), inset 0 2px 0 rgba(255,255,255,.35), 0 0 0 3px rgba(228,80,80,.25)",
      transform: "translateY(-2px)",
      filter: "none",
    },
    // 👇 override the yellow `:checked` skin during reveal
    [`${revealRoot} ${input}:checked + &`]: {
      background: "linear-gradient(180deg, #FF7A7A 0%, #E45050 100%)",
      boxShadow:
        "0 8px 0 rgba(0,0,0,.18), inset 0 2px 0 rgba(255,255,255,.35), 0 0 0 3px rgba(228,80,80,.25)",
      transform: "translateY(-2px)",
      filter: "none",
    },
  },
});
