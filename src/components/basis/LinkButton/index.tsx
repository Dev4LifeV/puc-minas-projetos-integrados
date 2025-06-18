import { ComponentProps } from "react";
import Link from "next/link";
import { Typography } from "../Typography";
import { themeVars } from "@/theme/theme.css";

export default function LinkButton({
  children,
  href,
  ...props
}: ComponentProps<"a"> & { href: string }) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" {...props}>
      <Typography.Caption isAnchor color={themeVars.color.accent}>
        {children}
      </Typography.Caption>
    </Link>
  );
}
