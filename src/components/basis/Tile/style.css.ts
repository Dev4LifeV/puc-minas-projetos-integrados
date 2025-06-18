import { style } from "@vanilla-extract/css";

export const tileContainer = style({
  backgroundColor: "#7A7A7A",
  height: "40px",
  width: "100%",
});

export const tile = style({
  height: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  textTransform: "uppercase",
  padding: "10px",
});

export const newOrderBadge = style({
  color: "lightgreen",
  fontWeight: "bold",
});
