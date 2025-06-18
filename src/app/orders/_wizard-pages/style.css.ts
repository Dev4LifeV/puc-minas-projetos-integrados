import { viewPort } from "@/theme/constants";
import { colors } from "@mui/material";
import { style } from "@vanilla-extract/css";

export const formFields = style({
  width: "60%",
  display: "flex",
  minHeight: "80vh",
  justifyContent: "center",
  flexDirection: "column",
  gap: "30px",

  "@media": {
    [viewPort.small]: {
      width: "100%",
    },
  },
});

export const saveButton = style({
  backgroundColor: `${colors.blue[500]} !important`,
  width: "100%",
});

export const form = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});
