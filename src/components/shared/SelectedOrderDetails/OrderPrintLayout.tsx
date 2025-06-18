import { printerTicket, ttu } from "./style.css";

import Order from "@/helpers/firestore/model/order/order";
import React from "react";

interface OrderPrintLayoutProps {
  selectedOrder?: Order | null;
}

export default function OrderPrintLayout({
  selectedOrder,
}: OrderPrintLayoutProps) {
  const subTotal = selectedOrder?.items.reduce(
    (acc, nextValue) => acc + nextValue.quantity * nextValue.product.value,
    0
  );
  const freightCost = selectedOrder?.address?.neighborhood?.freightCost;

  return (
    <table className={printerTicket}>
      <thead>
        <tr>
          <th colSpan={3}>
            {selectedOrder?.createdOn.toLocaleDateString()} -{" "}
            {selectedOrder?.createdOn.toLocaleTimeString()}
          </th>
        </tr>
        <tr>
          <th colSpan={3}>
            {selectedOrder?.orderIssuer}
            <br />
            {selectedOrder?.phoneNumber}
            <br />
            {selectedOrder?.address ? (
              <>
                {selectedOrder?.address.address},{" "}
                {selectedOrder?.address.number} - {selectedOrder?.address.apt}
                <br />
                {selectedOrder?.address.neighborhood.neighborhoodName},{" "}
                {selectedOrder?.address.postalCode}
              </>
            ) : (
              <div>RETIRADA</div>
            )}
          </th>
        </tr>
        <tr>
          <th className={ttu} colSpan={3}>
            <b>
              NÃO É DOCUMENTO FISCAL <br /> SIMPLES COMPROVANTE <br /> DE PEDIDO
            </b>
          </th>
        </tr>
      </thead>
      <tbody>
        {selectedOrder?.items.map(({ id, product, quantity, value }) => (
          <React.Fragment key={id}>
            <tr className="top">
              <td colSpan={3}>{product.description}</td>
            </tr>
            <tr>
              <td>
                R$
                {product.value.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td>{quantity}</td>
              <td>
                R$
                {(quantity * product.value).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
      <tfoot>
        <tr className={`sup ${ttu} p--0`}>
          <td colSpan={3}>
            <b>Totais</b>
          </td>
        </tr>
        <tr className={ttu}>
          <td colSpan={2}>Sub-total</td>
          <td align="right">
            R$
            {subTotal?.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </td>
        </tr>
        <tr className={ttu}>
          <td colSpan={2}>Taxa de entrega</td>
          {selectedOrder?.address ? (
            <>
              <td align="right">
                R$
                {freightCost?.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </>
          ) : (
            <td>RETIRADA</td>
          )}
        </tr>
        {subTotal && freightCost ? (
          <tr className={ttu}>
            <td colSpan={2}>Total</td>
            <td align="right">
              R$
              {(subTotal + freightCost).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        ) : (
          <tr className={ttu}>
            <td colSpan={2}>Total</td>
            <td align="right">
              R$
              {subTotal?.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        )}
        <tr className="sup ttu p--0">
          <td colSpan={3}>
            <b>Forma de pagamento</b>
          </td>
        </tr>
        <tr className={ttu}>
          <td colSpan={2}>{selectedOrder?.paymentMethod}</td>
        </tr>
      </tfoot>
    </table>
  );
}
