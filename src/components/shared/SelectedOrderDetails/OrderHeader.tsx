import Order from "@/helpers/firestore/model/order/order";
import { orderHeader } from "./style.css";

interface OrderHeaderProps {
  selectedOrder?: Order | null;
}

export default function OrderHeader({ selectedOrder }: OrderHeaderProps) {
  return (
    <caption className={orderHeader}>
      <h2>{selectedOrder?.orderIssuer}</h2>
      <h2>{selectedOrder?.phoneNumber}</h2>
      {selectedOrder?.address?.address ? (
        <h3>
          {selectedOrder?.address.address}, {selectedOrder?.address.number} -{" "}
          {selectedOrder?.address.apt}
        </h3>
      ) : (
        <h3>RETIRADA</h3>
      )}
      {selectedOrder?.address?.address && (
        <>
          <h3>
            {selectedOrder?.address.neighborhood.neighborhoodName},{" "}
            {selectedOrder?.address.postalCode}
          </h3>
          <h3>{selectedOrder?.address.reference}</h3>
        </>
      )}
      <h3>
        {selectedOrder?.createdOn.toLocaleDateString("pt-BR")} -{" "}
        {selectedOrder?.createdOn.toLocaleTimeString("pt-BR")}
      </h3>
    </caption>
  );
}
