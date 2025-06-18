import Caption from "./bold/Caption";
import DisplayLargeRegular from "./regular/DisplayLarge";
import DisplayMediumBold from "./bold/DisplayMedium";
import TitleBold from "./bold/Title";
import TitleLight from "./light/Title";
import TitleRegular from "./regular/Title";

export interface TypographyProps {
  color?: string;
  className?: string;
  isAnchor?: boolean;
  style?: React.CSSProperties;
}

export const Typography = {
  Caption,
  DisplayMediumBold,
  TitleBold,
  TitleLight,
  DisplayLargeRegular,
  TitleRegular,
};
