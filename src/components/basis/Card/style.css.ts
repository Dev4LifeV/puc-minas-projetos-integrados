import { viewPort } from "@/theme/constants";
import { themeVars } from "@/theme/theme.css";
import { style } from "@vanilla-extract/css";

export const card = style({
  backgroundColor: themeVars.color.card,
  height: "150px",
  color: "white",
  width: "100%",
  borderRadius: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textWrap: "nowrap",
  textDecoration: "none",
  textAlign: "center",
  fontSize: "1.6rem",
  "@media": {
    [viewPort.small]: {
      fontSize: "1.325rem",
    },
  },
});
