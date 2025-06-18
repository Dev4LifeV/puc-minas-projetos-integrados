"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

import useOrders from "@/app/orders/hooks/useOrders";
import ActionFeedback from "@/components/basis/ActionFeedback";
import LoadingContainer from "@/components/basis/LoadingContainer";
import useStoreStatus from "@/hooks/useStoreStatus";
import { useEffect } from "react";
import useSetProduct from "../hooks/useSetProduct";
import ProductForm from "../ProductForm";

export default function EditProduct() {
  const { save, loading, error, success } = useSetProduct();

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

  const [_, setOpenProducts] = useQueryState("openProducts", {
    ...parseAsBoolean,
    defaultValue: true,
  });

  useEffect(() => {
    setOpenProducts(true);
  }, [setOpenProducts]);

  return (
    <>
      <LoadingContainer
        loading={loading || loadingStoreStatus}
        error={error !== null || errorStoreStatus !== undefined}
      >
        <div style={{ paddingBottom: "40px" }}>
          <ProductForm onSubmit={save} loading={loading} error={error} />
        </div>
        {success && (
          <ActionFeedback
            message={success}
            open={success.length > 0}
            state="success"
            autoHideDuration={3000}
          />
        )}
      </LoadingContainer>
    </>
  );
}
