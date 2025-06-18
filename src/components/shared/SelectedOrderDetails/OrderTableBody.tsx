import "./style.css";

import Item from "@/helpers/firestore/model/order/item";
import Order from "@/helpers/firestore/model/order/order";

interface OrderTableBodyProps {
  selectedOrder?: Order | null;
}

export default function OrderTableBody({ selectedOrder }: OrderTableBodyProps) {
  return (
    <tbody>
      {selectedOrder?.items?.map(({ id, product, quantity, value }: Item) => (
        <tr key={product.id}>
          <td scope="row" data-label="Cód">
            {id}
          </td>
          <td scope="row" data-label="Descrição">
            {product.description}
          </td>
          <td scope="row" data-label="Quantidade">
            {quantity}
          </td>
          <td scope="row" data-label="Preço">
            R$
            {(quantity * product.value).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </td>
        </tr>
      ))}
    </tbody>
  );
}
