import { InputLabel, InputLabelProps, styled } from "@mui/material";

import { PropsWithChildren } from "react";

const StyledInputLabel = styled(InputLabel)(() => ({
  "&": {
    color: "white",
  },
  "&.Mui-focused": {
    color: "white",
  },
}));

export default function DropdownLabel({
  children,
  ...props
}: PropsWithChildren<InputLabelProps>) {
  return <StyledInputLabel {...props}>{children}</StyledInputLabel>;
}
