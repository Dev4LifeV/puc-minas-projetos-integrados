import { style } from "@vanilla-extract/css";

export const swiperContainer = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  // minHeight: "60vh",
  width: "100%",
  maxWidth: "100%",
  maxHeight: "100vh",
  // CSS Grid/Flexbox bug size workaround
  // @see https://github.com/kenwheeler/slick/issues/982
  // @see https://github.com/nolimits4web/swiper/issues/3599
  minHeight: "0",
  minWidth: "0",
});
