import { globalStyle, style } from "@vanilla-extract/css";

import { themeVars } from "@/theme/theme.css";
import { viewPort } from "@/theme/constants";

globalStyle("*", {
  padding: "0",
  margin: "0",
  boxSizing: "border-box",
  color: themeVars.color.common.white,
});

globalStyle(".Mui-checked > .MuiSwitch-thumb", {
  color: "#00FF00",
});

globalStyle(".Mui-checked ~ .MuiSwitch-track", {
  backgroundColor: "#00FF00 !important",
});

export const loginLayout = style({
  backgroundColor: themeVars.color.background,
  height: "100%",
});

export const hideWhatsappButtonOnPrint = style({
  "@media": {
    print: {
      display: "none",
    },
  },
});

export const layout = style({
  width: "100%",
  minHeight: "100vh",
  marginRight: "auto",
  marginLeft: "auto",
  backgroundColor: themeVars.color.background,
  "@media": {
    [viewPort.small]: {
      padding: "2rem",
      maxWidth: "640px",
    },
    [viewPort.md]: {
      maxWidth: "768px",
    },
    [viewPort.lg]: {
      maxWidth: "1024px",
    },
    [viewPort.xl]: {
      maxWidth: "1280px",
    },
    [viewPort.xxl]: {
      maxWidth: "1440px",
    },
  },
});
