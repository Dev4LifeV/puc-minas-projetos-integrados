import { globalStyle } from "@vanilla-extract/css";
import { roundedButton } from "@/components/basis/Button/RoundedButton/style.css";

globalStyle(`${roundedButton}`, {
  "@media": {
    print: {
      printColorAdjust: "exact",
      display: "none",
    },
  },
});
