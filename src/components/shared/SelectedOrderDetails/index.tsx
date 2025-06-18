import "./style.css";

import { Button, Stack, Typography, colors } from "@mui/material";
import { orderButtonContainer, totalContainer } from "./style.css";
import { useEffect, useRef, useState } from "react";

import CancelOrderButton from "./CancelOrderButton";
import { Edit } from "@icons/index";
import Order from "@/helpers/firestore/model/order/order";
import OrderButton from "./OrderButton";
import OrderHeader from "./OrderHeader";
import OrderPrintLayout from "./OrderPrintLayout";
import { OrderStatus } from "@/helpers/firestore/enum/order-status";
import OrderTable from "./OrderTable";
import OrderTableBody from "./OrderTableBody";
import OrderTableHead from "./OrderTableHead";
import { Save } from "@mui/icons-material";
import { themeVars } from "@/theme/theme.css";

interface OrderDetailsProps {
  selectedOrder?: Order | null;
  onUpdateStatus: (status: OrderStatus) => void;
  onCancelOrder?: () => void;
  onEditOrder?: (order: Order) => void;
}

export default function SelectedOrderDetails({
  selectedOrder,
  onUpdateStatus,
  onCancelOrder,
  onEditOrder,
}: OrderDetailsProps) {
  const total =
    selectedOrder?.items?.reduce(
      (acc, { quantity, product }) => acc + quantity * product.value,
      0
    ) ?? 0;

  const freightCost = selectedOrder?.address?.neighborhood?.freightCost ?? 0;

  const [editMode, setEditMode] = useState(false);
  const [notes, setNotes] = useState("");
  const observacoesRef = useRef<HTMLTextAreaElement>(null);

  const handleEditOrder = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (editMode && selectedOrder) {
      observacoesRef.current?.focus();

      const editedOrder = new Order(
        selectedOrder.id,
        selectedOrder.isViewed,
        selectedOrder.orderIssuer,
        selectedOrder.address,
        selectedOrder.items,
        selectedOrder.phoneNumber,
        selectedOrder.createdOn,
        selectedOrder.status,
        selectedOrder.paymentMethod,
        selectedOrder.uidOrderIssuer,
        notes
      );

      onEditOrder?.(editedOrder);
    }
  };

  useEffect(() => {
    if (selectedOrder?.notes) {
      setNotes(selectedOrder?.notes);
    }
  }, [selectedOrder]);

  return (
    <>
      <Button
        startIcon={
          editMode ? (
            <Save
              style={{
                fontSize: "1.5rem",
                fill: colors.blue[500],
              }}
            />
          ) : (
            <Edit />
          )
        }
        onClick={(e) => {
          setEditMode(!editMode);

          if (editMode) {
            handleEditOrder(e);
          } else {
            setTimeout(() => {
              observacoesRef.current?.focus();
            }, 0);
          }
        }}
      >
        <Stack direction="row" spacing={1}>
          <Typography
            color={editMode ? colors.blue[500] : "orange"}
            variant="h5"
          >
            {editMode ? "Salvar pedido" : "Editar pedido"}
          </Typography>
        </Stack>
      </Button>
      <OrderTable>
        <OrderHeader selectedOrder={selectedOrder} />
        <OrderTableHead />
        <OrderTableBody selectedOrder={selectedOrder} />
      </OrderTable>
      <div className={totalContainer}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontWeight: "bold" }}>Entrega</div>
          {selectedOrder?.address?.neighborhood?.freightCost ? (
            <div>
              R$
              {(
                selectedOrder?.address?.neighborhood.freightCost ?? 0
              ).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          ) : (
            <div>RETIRADA</div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontWeight: "bold" }}>Forma de pagamento</div>
          <div>{selectedOrder?.paymentMethod}</div>
        </div>

        <div
          style={{
            display: "flex",
            marginBottom: "2rem",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: "bold" }}>Total</div>
          <div>
            R${" "}
            {(total + freightCost).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        Observações
        <textarea
          ref={observacoesRef}
          onChange={(e) => setNotes(e.target.value)}
          disabled={!editMode}
          value={notes}
          rows={5}
          placeholder="Observações"
          style={{
            padding: "1rem",
            backgroundColor: themeVars.color.background,
            border: "1px solid white",
            borderRadius: "0.5rem",
          }}
        />
      </label>
      <div className={orderButtonContainer}>
        <OrderButton
          onUpdateStatus={onUpdateStatus}
          selectedOrder={selectedOrder}
        />
        {onCancelOrder &&
          selectedOrder &&
          selectedOrder.status !== OrderStatus.delivered && (
            <CancelOrderButton onCancelOrder={onCancelOrder} />
          )}
      </div>
      <OrderPrintLayout selectedOrder={selectedOrder} />
    </>
  );
}
