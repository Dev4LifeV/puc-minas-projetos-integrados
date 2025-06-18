import { style } from "@vanilla-extract/css";
import { viewPort } from "@/theme/constants";

export const homeHeader = style({
  marginBottom: "30px",
  textAlign: "center",
  display: "flex",
  gap: "1rem",
  alignItems: "center",
  justifyContent: "center",
});

export const homeContainer = style({
  "@media": {
    [viewPort.small]: {
      padding: "30px",
      top: 0,
    },
  },
  minWidth: "100%",
  position: "relative",
  top: 200,
});
