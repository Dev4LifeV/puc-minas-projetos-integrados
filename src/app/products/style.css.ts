import { viewPort } from "@/theme/constants";
import { style } from "@vanilla-extract/css";

export const fileInput = style({
  display: "none",
});

export const fileInputImage = style({
  height: "26rem",
  width: "40%",
  objectFit: "cover",
});

export const form = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

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
  backgroundColor: "orange !important",
  width: "100%",
});

export const menuButton = style({
  display: "flex",
  gap: "15px",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  border: "1px solid white",
  borderRadius: "50%",
  padding: "5rem",
  textAlign: "center",

  "@media": {
    [viewPort.small]: {
      flexDirection: "column",
    },
  },
});

export const menu = style({
  display: "flex",
  gap: "100px",

  "@media": {
    [viewPort.small]: {
      flexDirection: "column",
      gap: "50px",
    },
  },
});

export const picker = style({
  width: "40%",
  marginTop: "2rem",
  marginBottom: "40px",
  height: "26rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px white solid",
});
