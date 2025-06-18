import { CSSObject, Theme } from "@mui/material";

import { drawerWidth } from "./theme.css";

export const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  backgroundColor: "#333232",
  borderRightWidth: 1,
  borderRightColor: "white",
  borderRightStyle: "solid",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  [theme.breakpoints.up("sm")]: {
    width: drawerWidth,
    backgroundColor: "#333232",
  },
  overflowX: "hidden",
});

export const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  backgroundColor: "#333232",
  borderRightWidth: 1,
  borderRightColor: "white",
  borderRightStyle: "solid",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
    backgroundColor: "#333232",
  },
});
