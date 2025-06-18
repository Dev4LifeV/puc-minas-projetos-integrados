"use client";

import "./style.css";

import useOrders from "@/app/orders/hooks/useOrders";
import LoadingContainer from "@/components/basis/LoadingContainer";
import SelectedOrderDetails from "@/components/shared/SelectedOrderDetails";
import useStoreStatus from "@/hooks/useStoreStatus";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import useInvoices from "../hooks/useInvoices";

export default function InvoicedDetails() {
  const { getInvoice, error, loading, selectedOrder } = useInvoices();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getInvoice(id);
  }, [id, getInvoice]);

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

  return (
    <>
      <LoadingContainer
        loading={loading || loadingStoreStatus}
        error={
          (error === null &&
            selectedOrder === null &&
            selectedOrder === undefined) ||
          errorStoreStatus !== undefined
        }
      >
        <SelectedOrderDetails
          onUpdateStatus={() => {}}
          selectedOrder={selectedOrder}
        />
      </LoadingContainer>
    </>
  );
}
