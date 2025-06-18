import { storeClosed, storeOpenColor } from "./style.css";

import Switch from "@mui/material/Switch";

interface StoreSwitchProps {
  isOpen: boolean;
  onStoreOpen?: (open: boolean) => void;
}

export default function StoreSwitch({ onStoreOpen, isOpen }: StoreSwitchProps) {
  return (
    <div style={{ color: "white" }}>
      A loja está{" "}
      {isOpen ? (
        <span className={storeOpenColor}>aberta</span>
      ) : (
        <span className={storeClosed}>fechada</span>
      )}
      .
      <Switch
        checked={isOpen}
        onClick={() => {
          if (typeof onStoreOpen !== "undefined") {
            onStoreOpen!(!isOpen);
          }
        }}
        size="medium"
      />
    </div>
  );
}
