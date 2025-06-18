import { PropsWithChildren } from "react";
import { TypographyProps } from "@components/basis/Typography";
import { cn } from "@/utils/classNames";
import { displayMedium } from "./style.css";
import { themeVars } from "@/theme/theme.css";

export default function DisplayMedium({
  children,
  color = themeVars.color.common.white,
  style,
  className = undefined,
}: PropsWithChildren<TypographyProps>) {
  const displayStyle: React.CSSProperties = {
    color: color,
  };

  return (
    <h3
      className={cn(displayMedium, className)}
      style={{ ...displayStyle, ...style }}
    >
      {children}
    </h3>
  );
}
