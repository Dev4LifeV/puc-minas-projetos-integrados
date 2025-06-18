"use client";

import { useEffect, useState } from "react";

import InputText from "@/components/basis/InputText/InputText";
import ListTile from "@/components/basis/ListTile";
import LoadingContainer from "@/components/basis/LoadingContainer";
import Tile from "@/components/basis/Tile";
import Order from "@/helpers/firestore/model/order/order";
import useStoreStatus from "@/hooks/useStoreStatus";
import Link from "next/link";
import useOrders from "../orders/hooks/useOrders";
import useInvoices from "./hooks/useInvoices";

export default function Invoiced() {
  const { getInvoices, error, loading, orders } = useInvoices();

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  const { listenToOrders } = useOrders();
  const {
    storeStatus,
    loading: loadingStoreStatus,
    error: errorStoreStatus,
    getStoreStatus,
  } = useStoreStatus();

  useEffect(() => {
    getStoreStatus();
  }, [getStoreStatus]);

  useEffect(() => {
    listenToOrders(storeStatus?.storeStatus);
  }, [listenToOrders, storeStatus]);

  const [search, setSearch] = useState("");

  const filteredOrders = orders?.filter((o) =>
    o.orderIssuer.toUpperCase().includes(search.toUpperCase())
  );

  return (
    <>
      <div
        style={{
          padding: "1rem",
          zIndex: 10,
          width: "100%",
          backgroundColor: "GrayText",
          position: "sticky",
          top: 0,
          borderRadius: "10px",
        }}
      >
        <InputText
          label="Pesquisar por nome do cliente"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <LoadingContainer
        loading={loading || loadingStoreStatus}
        error={error !== undefined || errorStoreStatus !== undefined}
        isEmpty={orders === undefined || orders?.length <= 0}
        emptyMessage="Não há pedidos faturados"
      >
        {orders && (
          <ListTile>
            {filteredOrders?.map(({ orderIssuer, id, createdOn }: Order) => (
              <Link key={id} href={`/invoices/${id}`}>
                <Tile isDeletable={false}>
                  {createdOn?.toLocaleDateString("pt-BR")}{" "}
                  {createdOn?.toLocaleTimeString("pt-BR")} - {orderIssuer}
                </Tile>
              </Link>
            ))}
          </ListTile>
        )}
      </LoadingContainer>
    </>
  );
}
