import {
  orderButtonDeliveredStatus,
  orderButtonPickingStatus,
  orderButtonSentStatus,
} from "./style.css";

import Order from "@/helpers/firestore/model/order/order";
import { OrderStatus } from "@/helpers/firestore/enum/order-status";
import RoundedButton from "@/components/basis/Button/RoundedButton";

interface OrderButtonProps {
  selectedOrder?: Order | null;
  onUpdateStatus: (status: OrderStatus) => void;
}

export default function OrderButton({
  selectedOrder,
  onUpdateStatus,
}: OrderButtonProps) {
  switch (selectedOrder?.status) {
    case OrderStatus.picking:
      return (
        <RoundedButton
          onClick={() => onUpdateStatus(OrderStatus.sent)}
          className={orderButtonPickingStatus}
        >
          Alterar para saiu para entrega
        </RoundedButton>
      );
    case OrderStatus.sent:
      return (
        <RoundedButton
          onClick={() => onUpdateStatus(OrderStatus.delivered)}
          className={orderButtonSentStatus}
        >
          Alterar para pedido entregue
        </RoundedButton>
      );
    case OrderStatus.delivered:
      return (
        <RoundedButton
          onClick={window.print}
          className={orderButtonDeliveredStatus}
        >
          Imprimir
        </RoundedButton>
      );
  }
}
