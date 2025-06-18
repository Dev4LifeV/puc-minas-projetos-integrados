import { Drawer as MuiDrawer, styled } from "@mui/material";
import { closedMixin, openedMixin } from "@/theme/mixins";

import { drawerWidth } from "@/theme/theme.css";

export const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": {
          ...openedMixin(theme),
          backgroundColor: "#333232",
        },
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        backgroundColor: "#333232",
        ...closedMixin(theme),
        "& .MuiDrawer-paper": {
          ...closedMixin(theme),
          backgroundColor: "#333232",
        },
        "& .MuiPaper-root": {
          backgroundColor: "#333232",
        },
      },
    },
  ],
}));
