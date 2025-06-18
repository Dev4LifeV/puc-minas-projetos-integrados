import "./style.css";

import { PropsWithChildren } from "react";

export default function OrderTable({ children }: PropsWithChildren) {
  return <table>{children}</table>;
}
