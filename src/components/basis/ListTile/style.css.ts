import { globalStyle, style } from "@vanilla-extract/css";

import { themeVars } from "@/theme/theme.css";
import { tile } from "../Tile/style.css";

export const listTile = style({
  marginTop: "20px",
  width: "inherit",
});


globalStyle(`.${listTile} > a:nth-child(odd) > div`, {
  backgroundColor: themeVars.color.tileOdd,
});

globalStyle(`.${listTile} > a:nth-child(even) > div`, {
  backgroundColor: themeVars.color.tileEven,
});

globalStyle(`.${listTile} > a`, {
  textDecoration: "none"
})

globalStyle(`.${listTile} > div:nth-child(odd)`, {
  backgroundColor: themeVars.color.tileOdd
})

globalStyle(`.${listTile} > div:nth-child(even)`, {
  backgroundColor: themeVars.color.tileEven
})

