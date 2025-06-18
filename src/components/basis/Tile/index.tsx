import { IconButton, Typography } from "@mui/material";
import { newOrderBadge, tile } from "./style.css";

import Delete from "@icons/Delete";
import { Edit } from "@icons/index";
import { PropsWithChildren } from "react";

interface TileProps {
  isDeletable?: boolean;
  isEditable?: boolean;
  isNewOrder?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function Tile({
  children,
  isDeletable = true,
  isEditable = false,
  isNewOrder = false,
  onEdit,
  onDelete,
}: PropsWithChildren<TileProps>) {
  return (
    <div>
      <div className={tile}>
        <div>{children}</div>
        <div>
          {isEditable && (
            <IconButton onClick={onEdit}>
              <Edit />
              <Typography
                variant="h6"
                style={{ marginLeft: 4, color: "orange" }}
              >
                EDITAR
              </Typography>
            </IconButton>
          )}
          {isDeletable && (
            <IconButton
              style={{
                visibility: isDeletable ? "visible" : "hidden",
              }}
              onClick={onDelete}
            >
              <Delete />
              <Typography variant="h6" style={{ marginLeft: 4, color: "red" }}>
                EXCLUIR
              </Typography>
            </IconButton>
          )}
          {isNewOrder && <div className={newOrderBadge}>Novo pedido!</div>}
        </div>
      </div>
    </div>
  );
}
