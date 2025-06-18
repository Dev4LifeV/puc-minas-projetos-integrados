import Order from "@/helpers/firestore/model/order/order";
import RoundedButton from "@/components/basis/Button/RoundedButton";
import { cancelButton } from "./style.css";

interface CancelOrderButtonProps {
  selectedOrder?: Order | null;
  onCancelOrder: () => void;
}

export default function CancelOrderButtonProps({
  onCancelOrder,
}: CancelOrderButtonProps) {
  return (
    <RoundedButton onClick={onCancelOrder} className={cancelButton}>
      Cancelar/Excluir pedido
    </RoundedButton>
  );
}
