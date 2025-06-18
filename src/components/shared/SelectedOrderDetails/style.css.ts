import { globalStyle, style } from "@vanilla-extract/css";

import { themeVars } from "@/theme/theme.css";

export const orderButtonPickingStatus = style({
  width: "100%",
  backgroundColor: "green !important",
});

export const orderButtonSentStatus = style({
  width: "100%",
  backgroundColor: "orange !important",
});

export const orderButtonDeliveredStatus = style({
  width: "100%",
  backgroundColor: "blue !important",
});

export const cancelButton = style({
  width: "100%",
  backgroundColor: "red !important",
});

export const orderButtonContainer = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "1.5rem",
  marginTop: "2rem",
});

export const orderHeader = style({
  textAlign: "center",
});

globalStyle("table", {
  border: "1px solid #ccc",
  borderCollapse: "collapse",
  margin: 0,
  padding: 0,
  color: "white",
  width: "100%",
  tableLayout: "fixed",
  "@media": {
    print: {
      display: "none",
    },
  },
});

globalStyle("table caption", {
  fontSize: "1.5em",
  margin: ".5em 0 .75em",
});

globalStyle("table tr", {
  border: "1px solid #ddd",
  padding: ".35em",
  backgroundColor: themeVars.color.tileOdd,
});

globalStyle("table th, table td", {
  padding: "1em",

  textAlign: "center",
});

globalStyle("table th", {
  color: "white",
  fontSize: ".85em",
  letterSpacing: ".1em",
  textTransform: "uppercase",
});

globalStyle("table", {
  "@media": {
    "screen and (max-width: 768px)": {
      border: 0,
    },
  },
});

globalStyle("table caption", {
  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: "1.3em",
    },
  },
});

globalStyle("table thead", {
  "@media": {
    "screen and (max-width: 768px)": {
      border: "none",
      clip: "rect(0 0 0 0)",
      height: "1px",
      margin: "-1px",
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      width: "1px",
    },
  },
});

globalStyle("table tr", {
  "@media": {
    "screen and (max-width: 768px)": {
      display: "block",
      marginBottom: ".625em",
    },
  },
});

globalStyle("table td", {
  "@media": {
    "screen and (max-width: 768px)": {
      borderBottom: "1px solid #ddd",
      display: "block",
      fontSize: ".8em",
      textAlign: "right",
    },
  },
});

globalStyle("table td::before", {
  "@media": {
    "screen and (max-width: 768px)": {
      content: "attr(data-label)",
      float: "left",
      fontWeight: "bold",
      textTransform: "uppercase",
    },
  },
});

globalStyle("table td:last-child", {
  "@media": {
    "screen and (max-width: 768px)": {
      borderBottom: 0,
      marginBottom: "1em",
    },
  },
});

export const totalContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  marginTop: "1rem",
  "@media": {
    print: {
      display: "none",
    },
  },
});

export const textCenter = style({
  textAlign: "right",
});

const colorGray = "#BCBCBC";
const printerPaddingBase = "10px";

export const ttu = style({
  textTransform: "uppercase",
});

export const printerTicket = style({
  all: "initial",
  display: "none",
  width: "100%",
  maxWidth: "400px",
  lineHeight: "1.3em",
  textAlign: "left",
  "@media": {
    print: {
      display: "table !important",
    },
  },
});

// Apply global styles within the printerTicket container
globalStyle(`${printerTicket}, ${printerTicket} *`, {
  fontFamily: "Tahoma, Geneva, sans-serif",
  textAlign: "left",
  color: "black !important",
  fontSize: "10px",
  margin: "0",
  padding: "0",
});

globalStyle(
  `${printerTicket} th:nth-child(2), ${printerTicket} td:nth-child(2)`,
  {
    width: "50px",
  }
);

globalStyle(
  `${printerTicket} th:nth-child(3), ${printerTicket} td:nth-child(3)`,
  {
    width: "90px",
    textAlign: "right",
  }
);

globalStyle(`${printerTicket} th`, {
  fontWeight: "inherit",
  padding: `${printerPaddingBase} 0`,
  textAlign: "left",
  borderBottom: `1px dashed ${colorGray}`,
});

globalStyle(`${printerTicket} tbody tr:last-child td`, {
  paddingBottom: printerPaddingBase,
});

globalStyle(`${printerTicket} tfoot .sup td`, {
  padding: `${printerPaddingBase} 0`,
  borderTop: `1px dashed ${colorGray}`,
});

globalStyle(`${printerTicket} tfoot .sup.p--0 td`, {
  paddingBottom: "0",
});

globalStyle(`${printerTicket} .title`, {
  fontSize: "1.5em",
  padding: "15px 0",
});

globalStyle(`${printerTicket} .top td`, {
  paddingTop: printerPaddingBase,
});

globalStyle(`${printerTicket} .last td`, {
  paddingBottom: printerPaddingBase,
});
