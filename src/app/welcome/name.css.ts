import { style } from "@vanilla-extract/css";

export const wrapper = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: `url('/assets/bg.png') center / cover no-repeat`,
});

export const logo = style({
    marginTop: 50,
});

export const form = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 50,
});

export const label = style({
    fontSize: 44,
    fontWeight: "bold",
    color: "#ffff",
});

export const input = style({
    background: `url('/assets/Input.png') no-repeat center / 100% 100%`,
    width: 680,
    height: 80,
    border: "none",
    textAlign: "center",
    marginTop: 20,
    fontSize: 34,
    fontWeight: "bold",
    color: "#ffff",
    caretColor: "transparent",
    selectors: {
        "&:focus": {
            outline: "none",
        }
    }
});

export const btn = style({
    background: 'linear-gradient(180deg, #54D86D 0%, #1EB44C 90%)',
    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
    width: 240,
    height: 90,
    borderRadius: 90,
    border: "none",
    textAlign: "center",
    cursor: "pointer",
    transition: "filter 0.2s ease",
    color: "#ffff",
    fontSize: 40,
    marginTop: 30,
    fontWeight: "bold",
    selectors: {
        "&:hover": {
            filter: "brightness(1.05)",
        }
    }
});