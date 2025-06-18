import { globalStyle, style } from "@vanilla-extract/css";

import { viewPort } from "@/theme/constants";

globalStyle(".MuiSnackbarContent-root", {
  backgroundColor: "red",
});

export const userForm = style({
  display: "flex",
  alignItems: "center",
  gap: "1.25rem",
  "@media": {
    [viewPort.small]: {
      flexDirection: "column",
    },
  },
});

const users = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  alignItems: "center",
  "@media": {
    [viewPort.small]: {
      padding: "20px",
    },
  },
});

export default users;
