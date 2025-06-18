"use client";

import { useContext, useEffect } from "react";

import { Add } from "@icons/index";
import Link from "next/link";
import ListTile from "@/components/basis/ListTile";
import LoadingContainer from "@/components/basis/LoadingContainer";
import { OrderContext } from "./context/OrderContext";
import Tile from "@/components/basis/Tile";
import useOrders from "./hooks/useOrders";

const CreateOrderButton = () => {
  return (
    <Link href={`/orders/new-order-wizard`}>
      <div
        style={{
          borderRadius: "3rem",
          padding: "2rem",
          border: "2px solid",
          gap: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {" "}
        <Add /> Cadastrar Novo Pedido
      </div>
    </Link>
  );
};

export default function Orders() {
  const { loading, error, orders, storeStatus, getStoreStatus } =
    useContext(OrderContext);
  const { listenToOrders } = useOrders();

  useEffect(() => {
    listenToOrders(storeStatus);
    getStoreStatus();
  }, [listenToOrders, storeStatus, getStoreStatus]);

  return (
    <>
      <LoadingContainer
        loading={loading || storeStatus === undefined}
        error={error !== undefined}
        isEmpty={orders === undefined || orders?.length <= 0}
        emptyComponent={<CreateOrderButton />}
        emptyMessage={
          storeStatus === false
            ? "A loja está fechada. Abra a loja para ver os pedidos."
            : orders === undefined || orders.length <= 0
            ? "Não há pedidos em andamento"
            : undefined
        }
      >
        <CreateOrderButton />
        {orders && (
          <>
            <ListTile>
              {orders
                .sort((a, b) => b.createdOn.getTime() - a.createdOn.getTime())
                .map(({ orderIssuer, id, createdOn, isViewed, address }) => (
                  <Link key={id} href={`/orders/${id}`}>
                    <Tile isDeletable={false} isNewOrder={!isViewed}>
                      {createdOn?.toLocaleDateString("pt-BR")}{" "}
                      {createdOn?.toLocaleTimeString("pt-BR")} - {orderIssuer}
                      {!address && (
                        <span style={{ color: "orange", fontWeight: "bold" }}>
                          <span style={{ color: "white" }}> - </span>RETIRADA
                        </span>
                      )}
                    </Tile>
                  </Link>
                ))}
            </ListTile>
          </>
        )}
      </LoadingContainer>
    </>
  );
}
