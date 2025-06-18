import { fontFace, style } from "@vanilla-extract/css";

import { viewPort } from "@/theme/constants";

fontFace({
  src: "/fonts/subvario-ot-w03-cond-dry.ttf",
});

export const container = style({
  display: "grid",
  gridTemplateColumns: "0.5fr 0.5fr",
  gridTemplateRows: "100vh",
  "@media": {
    [viewPort.small]: {
      minHeight: "100svh",
      gridTemplateColumns: "1fr",
      gridTemplateRows: "1fr",
      padding: "30px",
    },
  },
});

export const loginContainer = style({
  display: "flex",
  position: "relative",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
});

export const loginContent = style({
  textAlign: "center",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
  bottom: "120px",
  "@media": {
    [viewPort.small]: {
      bottom: "0px",
    },
  },
});

export const welcomeBackTitle = style({
  marginBottom: "50px",
});

export const imageContainer = style({
  height: "100%",
});
