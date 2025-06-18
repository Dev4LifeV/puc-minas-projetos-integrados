import { ComponentProps } from "react";

export default function DropdownItem({
  children,
  ...props
}: ComponentProps<"option">) {
  return <option {...props}>{children}</option>;
}
