export type MenuItemType = {
  path?: string;
  label: string;
  key?: string;
  icon: React.JSX.Element;
  subitems?: MenuItemType[];
};
