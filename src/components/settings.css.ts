import { style } from "@vanilla-extract/css";

/* Floating gear button */
export const btn = style({
  position: "fixed",
  left: 20,
  top: 20,
  zIndex: 60,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  transition: "transform .3s ease",
  ":hover": { transform: "rotate(45deg) scale(1.02)" },
});

/* Scrim behind the drawer */
export const scrim = style({
  position: "fixed",
  inset: 0,
  zIndex: 80,
  background: "rgba(10, 0, 35, 0.55)",
  backdropFilter: "blur(1px)",
  border: "none",
  cursor: "pointer",
  width: "1366px",
  height: "768px",
});

/* Drawer panel */
export const drawer = style({
  position: "fixed",
  zIndex: 90,
  inset: 0,
  width: 360,
  maxWidth: "85vw",
  background: "linear-gradient(180deg, #7B2FF7 0%, #5521B5 100%)",
  opacity: 0.9,
  color: "#fff",
  transform: "translateX(-100%)",
  transition: "transform 260ms ease-in-out",
  boxShadow: "0 0px 60px rgba(0,0,0,.35)",
  borderRight: "3px solid rgba(255,255,255,.08)",
  height: "768px",
  maxHeight: "100%",
});
export const drawerOpen = style({ transform: "translateX(0)" });

/* Drawer header */
export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingRight: 8,
  marginBottom: 38,
  marginTop: 16,
  marginLeft: 16,
});
export const headerTitle = style({
  fontSize: 32,
  fontWeight: 800,
  letterSpacing: 0.2,
});
export const close = style({
  border: "none",
  background: "transparent",
  color: "#fff",
  cursor: "pointer",
  fontSize: 42,
  lineHeight: 1,
  padding: 4,
  borderRadius: 8,
  selectors: {
    "&:hover": { background: "rgba(255,255,255,.12)" },
    "&:active": { transform: "scale(.98)" },
  },
});

/* Items */
export const list = style({
  display: "grid",
  gap: 10,
  marginTop: 8,
});

const baseItem = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  padding: "14px 0",
  color: "#fff",
  textDecoration: "none",
  fontSize: 32,
  fontWeight: 700,
  background: "transparent",
  border: "none",
  transition: "background .18s ease, transform .06s ease",
  cursor: "pointer",
  selectors: {
    "&:hover": { background: "rgba(255,255,255,.12)" },
    "&:active": { transform: "translateY(1px)" },
  },
} as const;

export const item = style(baseItem);
export const label = style({});
export const subLabel = style({
  marginLeft: 90,
});


export const icon = style({
  width: 28,
  height: 28,
  marginLeft: 32,
  marginRight: 32,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 24,
  lineHeight: 1,
});

export const chevron = style({
  opacity: 0.9,
  fontSize: 18,
});

/* Submenu */
export const submenu = style({
  display: "grid",
  gap: 8,
  marginTop: 4,
});
export const subItem = style({
  ...baseItem,
  fontSize: 18,
});
export const subIcon = style({
  width: 24,
  height: 24,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 18,
});

/* Footer */
export const footer = style({
  marginTop: "auto",
  paddingTop: 16,
  opacity: 0.9,
  fontWeight: 600,
  fontSize: 14,
  position: "absolute",
  bottom: 30,
  left: 0,
  right: 0,
  textAlign: "center",
});
