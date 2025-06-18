import { style } from "@vanilla-extract/css";
import { viewPort } from "@/theme/constants";

export const title = style({
  fontWeight: "lighter",
  fontSize: "1.75rem",
  "@media": {
    [viewPort.small]: {
      fontSize: "1.5rem",
    },
  },
});
