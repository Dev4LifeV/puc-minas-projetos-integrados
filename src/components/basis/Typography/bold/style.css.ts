import { style } from "@vanilla-extract/css";
import { viewPort } from "@/theme/constants";

export const caption = style({
  fontWeight: "bold",
});

export const displayMedium = style({
  fontSize: "1.375rem",
  "@media": {
    [viewPort.small]: {
      fontSize: "1.125rem",
    },
  },
  fontWeight: "bold",
});

export const title = style({
  fontSize: "1.75rem",
  "@media": {
    [viewPort.small]: {
      fontSize: "1.5rem",
    },
  },
  fontWeight: "bold",
});
