import { ComponentProps, forwardRef, useId } from "react";

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
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        width: "100%",
      }}
    >
      <label htmlFor={inputId}>{label}</label>
      <input
        style={{ border: error ? "1px solid red" : undefined }}
        {...props}
        ref={ref}
        autoComplete="new-password"
        autoCorrect="false"
        id={inputId}
        type="text"
        placeholder={label}
        className={cn(outlineBorder, props.className)}
      />
    </div>
  );
});

export default InputText;
