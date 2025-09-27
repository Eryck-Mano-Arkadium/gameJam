import { style } from "@vanilla-extract/css";

export const wrapper = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "900px",
});

export const title = style({
  fontSize: 44,
  fontWeight: 800,
  color: "#fff",
  textTransform: "uppercase",
  marginBottom: 16,
});

export const list = style({
  display: "flex",
  flexDirection: "column",
  width: "min(960px, 100%)",
});

export const empty = style({
  color: "#fff",
  opacity: 0.8,
  padding: "12px 0",
  textAlign: "center",
  fontSize: 18,
});

/** Base row (top 5 & others) */
export const row = style({
  background: "url('/assets/lb-box.png') center / 100% 100% no-repeat",
  minHeight: 86,
  borderRadius: 24,
  display: "grid",
  gridTemplateColumns: "64px 72px 1fr 120px",
  alignItems: "center",
  padding: "0 24px",
  color: "#fff",
});

/** Current user row (highlight) */
export const rowUser = style({
  background: "url('/assets/lb-box-user.png') center / 100% 100% no-repeat",
});

/** Cells */
export const rankCell = style({
  fontSize: 28,
  fontWeight: 800,
  textAlign: "center",
});

export const avatar = style({
  width: 57,
  height: 57,
  objectFit: "contain",
  // the medal frames already include a ring; keep round look for generic avatar
  borderRadius: 9999,
});

export const name = style({
  fontSize: 32,
  fontWeight: 800,
  letterSpacing: 0.3,
  paddingLeft: 8,
  selectors: {
    '&[aria-current="true"]': {
      // emphasize "(Me)"
      textShadow: "0 1px 0 rgba(0,0,0,.25)",
    },
  },
});

export const score = style({
  fontSize: 32,
  fontWeight: 900,
  textAlign: "right",
});
