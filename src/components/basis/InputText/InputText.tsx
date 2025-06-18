import { ComponentProps, forwardRef } from "react";

import { cn } from "@/utils/classNames";
import { outlineBorder } from "./style.css";

interface InputTextProps {
  label: string;
  error?: boolean;
  id?: string;
  mask?: string;
}

const InputText = forwardRef<
  HTMLInputElement,
  InputTextProps & ComponentProps<"input">
>(function InputText(
  {
    label,
    error = false,
    id,
    mask,
    ...props
  }: InputTextProps & ComponentProps<"input">,
  ref
) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        width: "100%",
      }}
    >
      <label htmlFor={id}>{label}</label>
      <input
        style={{ border: error ? "1px solid red" : undefined }}
        {...props}
        ref={ref}
        autoComplete="new-password"
        autoCorrect="false"
        id={id}
        type="text"
        placeholder={label}
        className={cn(outlineBorder, props.className)}
      />
    </div>
  );
});

export default InputText;
