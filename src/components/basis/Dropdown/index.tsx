import { ComponentProps, forwardRef } from "react";

import { outlineBorder } from "./style.css";

const Dropdown = forwardRef<
  HTMLSelectElement,
  ComponentProps<"select"> & { id?: string; label?: string }
>(function Dropdown(
  {
    children,
    id,
    label,
    ...props
  }: ComponentProps<"select"> & { id?: string; label?: string },
  ref
) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label htmlFor={id}>{label}</label>
      <select ref={ref} className={outlineBorder} {...props} id={id}>
        {children}
      </select>
    </div>
  );
});

export default Dropdown;
