"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

import useOrders from "@/app/orders/hooks/useOrders";
import ListTile from "@/components/basis/ListTile";
import LoadingContainer from "@/components/basis/LoadingContainer";
import Tile from "@/components/basis/Tile";
import useStoreStatus from "@/hooks/useStoreStatus";
import { Add } from "@icons/index";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useCategories from "../hooks/useCategories";

export default function ListProducts() {
  const { categories, error, loading } = useCategories();

  const router = useRouter();

  const [_, setOpenProducts] = useQueryState("openProducts", {
    ...parseAsBoolean,
    defaultValue: true,
  });

  useEffect(() => {
    setOpenProducts(true);
  }, [setOpenProducts]);

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
      <Link href={`/products/categories/new`}>
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
          <Add /> Nova Categoria
        </div>
      </Link>
      <LoadingContainer
        loading={loading || loadingStoreStatus}
        error={error !== null || errorStoreStatus !== undefined}
        isEmpty={categories === undefined || categories?.length <= 0}
        emptyMessage="Não há categorias cadastradas"
      >
        <div>
          <ListTile>
            {categories.map(({ name, id }) => (
              <Tile
                onEdit={() => router.push(`/products/categories/${id}`)}
                isEditable={true}
                isDeletable={false}
                key={id}
              >
                {name}
              </Tile>
            ))}
          </ListTile>
        </div>
      </LoadingContainer>
    </>
  );
}
