import { PropsWithChildren } from "react";
import { TypographyProps } from "@components/basis/Typography";
import { caption } from "./style.css";
import { cn } from "@/utils/classNames";
import { themeVars } from "@/theme/theme.css";

export default function Caption({
  children,
  color = themeVars.color.common.white,
  className = undefined,
  isAnchor = false,
}: PropsWithChildren<TypographyProps>) {
  const captionStyle: React.CSSProperties = {
    color: color,
    textDecorationColor: color,
    textDecoration: isAnchor ? "underline" : "none",
  };

  return (
    <span className={cn(caption, className)} style={captionStyle}>
      {children}
    </span>
  );
}
