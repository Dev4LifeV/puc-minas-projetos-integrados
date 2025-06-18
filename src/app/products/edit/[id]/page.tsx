"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

import useOrders from "@/app/orders/hooks/useOrders";
import ActionFeedback from "@/components/basis/ActionFeedback";
import LoadingContainer from "@/components/basis/LoadingContainer";
import useStoreStatus from "@/hooks/useStoreStatus";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import useProduct from "../../hooks/useProduct";
import useSetProduct from "../../hooks/useSetProduct";
import ProductForm from "../../ProductForm";

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();

  const { error, loading, product } = useProduct(id);

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

  const {
    save,
    loading: loadingSave,
    error: errorSave,
    success: successSave,
    product: updated,
  } = useSetProduct(true);

  return (
    <>
      <LoadingContainer
        loading={loading || loadingSave || loadingStoreStatus}
        error={
          error !== null ||
          product === null ||
          errorSave !== null ||
          errorStoreStatus !== undefined
        }
      >
        <div style={{ paddingBottom: "40px" }}>
          <ProductForm
            onSubmit={save}
            defaultValue={updated === undefined ? product : updated}
            loading={loading}
            error={error}
          />
        </div>
        {successSave && (
          <ActionFeedback
            message={successSave}
            open={successSave.length > 0}
            state="success"
            autoHideDuration={3000}
          />
        )}
      </LoadingContainer>
    </>
  );
}
