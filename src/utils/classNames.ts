export const cn = (...classes: Array<string | undefined>): string => {
  if (!classes || !classes.length) return "";
  return classes.filter(Boolean).join(" ").trim();
};
