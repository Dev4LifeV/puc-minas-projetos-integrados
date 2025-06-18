import { style } from "@vanilla-extract/css";

const outlineBorder = style({
  ":focus": {
    outline: "white",
  },
  color: "white",
  background: "#3d3d3d",
  border: "0.5px solid white",
  borderRadius: "4px",
  padding: "0.5rem 0.5rem",
});

export { outlineBorder };
