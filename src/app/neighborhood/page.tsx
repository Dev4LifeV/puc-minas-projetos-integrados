"use client";

import ActionFeedback from "@/components/basis/ActionFeedback";
import ListTile from "@/components/basis/ListTile";
import LoadingContainer from "@/components/basis/LoadingContainer";
import Tile from "@/components/basis/Tile";
import Neighborhood from "@/helpers/firestore/model/neighborhood/neighborhood";
import useStoreStatus from "@/hooks/useStoreStatus";
import { useEffect } from "react";
import useOrders from "../orders/hooks/useOrders";
import useNeighborhood from "./hooks/useNeighborhood";
import NewNeighborhoodForm from "./NewNeighborhoodForm";

export default function NeighborhoodPage() {
  const {
    error,
    loading,
    neighborhoods,
    removeNeighborhood,
    setNeighborhood,
    success,
  } = useNeighborhood();

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
      <div style={{ marginTop: "20px", width: "inherit" }}>
        <NewNeighborhoodForm
          onSubmit={async ({ freightCost, neighborhoodName }) => {
            const neighborhoodId = `${neighborhoodName?.at(
              0
            )}${neighborhoodName?.at(1)}-${Math.round(
              new Date().getTime() / 1000
            )}`;
            setNeighborhood(
              new Neighborhood(neighborhoodId, neighborhoodName!, freightCost!)
            );
          }}
        />
      </div>
      <LoadingContainer
        loading={loading || loadingStoreStatus}
        error={error !== null || errorStoreStatus !== undefined}
        isEmpty={neighborhoods === undefined || neighborhoods?.length <= 0}
        emptyMessage="Não há bairros cadastrados"
      >
        <div>
          <ListTile>
            {neighborhoods.length > 0 &&
              neighborhoods.map(
                ({ neighborhoodName, freightCost, id }: Neighborhood) =>
                  id && (
                    <Tile
                      key={id}
                      isDeletable
                      onDelete={() => removeNeighborhood(id)}
                    >
                      {neighborhoodName} - R$
                      {freightCost?.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </Tile>
                  )
              )}
          </ListTile>
        </div>
        {error && (
          <ActionFeedback
            message={error}
            autoHideDuration={3000}
            open={error.length > 0}
            state="error"
          />
        )}
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
