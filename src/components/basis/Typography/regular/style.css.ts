import { style } from "@vanilla-extract/css";
import { viewPort } from "@/theme/constants";

export const displayLarge = style({
  fontSize: "1.5rem",
  "@media": {
    [viewPort.small]: {
      fontSize: "1.25rem",
    },
  },
  fontWeight: "normal",
});

export const title = style({
  fontSize: "1.75rem",
  "@media": {
    [viewPort.small]: {
      fontSize: "1.5rem",
    },
  },
  fontWeight: "normal",
});
