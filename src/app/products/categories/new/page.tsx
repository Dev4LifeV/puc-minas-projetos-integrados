"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

import useOrders from "@/app/orders/hooks/useOrders";
import ActionFeedback from "@/components/basis/ActionFeedback";
import LoadingContainer from "@/components/basis/LoadingContainer";
import useStoreStatus from "@/hooks/useStoreStatus";
import { useEffect } from "react";
import CategoryForm from "../../CategoryForm";
import useSetCategory from "../../hooks/useSetCategory";

export default function NewCategory() {
  const {
    save,
    loading: loadingSave,
    error: errorSave,
    success: successSave,
  } = useSetCategory(true);

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
        loading={loadingSave || loadingStoreStatus}
        error={errorSave !== null || errorStoreStatus !== undefined}
      >
        <div style={{ paddingBottom: "40px" }}>
          <CategoryForm
            onSubmit={save}
            loading={loadingSave}
            error={errorSave}
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
