import { ComponentProps, PropsWithChildren, forwardRef } from "react";

import { cn } from "@/utils/classNames";
import { Typography } from "../../Typography";
import { roundedButton } from "./style.css";

interface RoundedButtonProps {
  buttonColor?: string;
}

const RoundedButton = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ComponentProps<"button">> & RoundedButtonProps
>(function RoundedButton(
  {
    buttonColor = "transparent",
    children,
    className,
    ...props
  }: PropsWithChildren<ComponentProps<"button">> & RoundedButtonProps,
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(roundedButton, className)}
      style={{ backgroundColor: buttonColor }}
      {...props}
    >
      <Typography.DisplayMediumBold>{children}</Typography.DisplayMediumBold>
    </button>
  );
});

export default RoundedButton;
