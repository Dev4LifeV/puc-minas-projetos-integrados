import { PropsWithChildren, useState } from "react";

import Snackbar from "@mui/material/Snackbar";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";

interface ActionFeedbackProps {
  state: "success" | "error";
  isClosable?: boolean;
  open: boolean;
  message: string | undefined;
  autoHideDuration?: number | null;
  fullWidth?: boolean;
}

const Success = ({
  message,
  open,
  autoHideDuration,
  isClosable = true,
  fullWidth = false,
  children,
  onClose,
}: PropsWithChildren<ActionFeedbackProps> & { onClose?: () => void }) => {
  const theme = createTheme({
    components: {
      MuiSnackbarContent: {
        styleOverrides: {
          message: fullWidth
            ? {
                textAlign: "center",
                width: "100%",
              }
            : undefined,
          root: {
            "&.MuiSnackbarContent-root": {
              width: fullWidth ? "95vw" : "auto",
              backgroundColor: "green",
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Snackbar
        open={open}
        onClose={onClose}
        onClick={onClose}
        ClickAwayListenerProps={{
          onClickAway: isClosable ? () => false : () => {},
        }}
        message={message}
        autoHideDuration={autoHideDuration}
      />
      {children}
    </ThemeProvider>
  );
};

const Error = ({
  message,
  open,
  autoHideDuration,
  onClose,
}: ActionFeedbackProps & { onClose?: () => void }) => {
  const theme = createTheme({
    components: {
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            "&.MuiSnackbarContent-root": {
              backgroundColor: "red",
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Snackbar
        open={open}
        onClose={onClose}
        onClick={onClose}
        message={message}
        autoHideDuration={autoHideDuration}
      />
    </ThemeProvider>
  );
};

export default function ActionFeedback({
  message,
  open,
  autoHideDuration,
  state,
  fullWidth,
  children,
  onClose,
}: PropsWithChildren<ActionFeedbackProps> & { onClose?: () => void }) {
  return state === "success" ? (
    <Success
      message={message}
      open={open}
      state={state}
      fullWidth={fullWidth}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
    >
      {children}
    </Success>
  ) : (
    <Error
      message={message}
      open={open}
      state={state}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
    />
  );
}
