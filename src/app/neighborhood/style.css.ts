import { style } from "@vanilla-extract/css";
import { viewPort } from "@/theme/constants";

export const form = style({
  display: "flex",
  alignItems: "center",
  gap: "1.25rem",

  "@media": {
    [viewPort.small]: {
      flexDirection: "column",
    },
  },
});
