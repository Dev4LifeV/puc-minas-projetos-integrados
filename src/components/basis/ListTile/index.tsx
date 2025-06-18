import { PropsWithChildren } from "react";
import { listTile } from "./style.css";

export default function ListTile({ children }: PropsWithChildren) {
  return <div className={listTile}>{children}</div>;
}
