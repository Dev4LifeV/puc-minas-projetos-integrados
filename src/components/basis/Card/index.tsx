import { IconType } from "@/utils/IconType";
import Link from "next/link";
import { Typography } from "../Typography";
import { card } from "./style.css";

interface CardProps {
  label: string;
  Icon: IconType;
  shadow?: string;
  href?: string;
}

export default function Card({
  href,
  Icon,
  label,
  shadow = undefined,
}: CardProps) {
  const safeHref = href && href.length > 0 ? href : "#";
  return (
    <Link href={safeHref} className={card} style={{ boxShadow: shadow }}>
      <div>
        <Icon fontSize={36} />
        <Typography.TitleRegular>{label}</Typography.TitleRegular>
      </div>
    </Link>
  );
}
