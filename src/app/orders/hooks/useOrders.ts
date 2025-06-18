import { errorMessage, successMessage } from "@/utils/texts";
import { useCallback, useContext } from "react";

import Address from "@/helpers/firestore/model/order/address";
import { Category } from "@/helpers/firestore/model/product/category";
import { Collections } from "@/helpers/firestore/collections";
import Item from "@/helpers/firestore/model/order/item";
import Neighborhood from "@/helpers/firestore/model/neighborhood/neighborhood";
import Order from "@/helpers/firestore/model/order/order";
import { OrderContext } from "../context/OrderContext";
import { OrderStatus } from "@/helpers/firestore/enum/order-status";
import { Product } from "@/helpers/firestore/model/product/product";
import useFirebase from "@/helpers/firestore/hooks/useFirebase";

export default function useOrders() {
  const { getBy, getRealtime, set, remove, get } = useFirebase();

  const {
    setError,
    setLoading,
    setOrders,
    setSelectedOrder,
    orders,
    loading,
    success,
    setSuccess,
    error,
  } = useContext(OrderContext);

  const createOrder = (
    data: any,
    isViewed: boolean = false,
    status?: OrderStatus
  ) => {
    console.log(data);
    return new Order(
      data?.id,
      !isViewed ? data?.isViewed : isViewed,
      data?.orderIssuer,
      data?.address
        ? new Address(
            data?.address?.address,
            data?.address?.number,
            data?.address?.apt,
            new Neighborhood(
              data?.address?.neighborhood.id,
              data?.address?.neighborhood.neighborhoodName,
              data?.address?.neighborhood.freightCost
            ),
            data?.address?.reference,
            data?.address?.postalCode
          )
        : null,
      data?.items?.map(
        (content: any) =>
          new Item(
            content.product.id,
            new Product(
              content.product.id,
              content.product.description,
              content.product.value,
              new Category(
                content.product.category.id,
                content.product.category.name
              ),
              content.product.inventory,
              content.product.image
            ),
            content.quantity,
            content.value
          )
      ),
      data?.phoneNumber,
      new Date(data?.createdOn),
      status === undefined ? data.status : status,
      data?.paymentMethod,
      data?.uidOrderIssuer,
      data?.notes ?? ""
    );
  };

  const createNewOrder = useCallback(
    (order: Order, onCreate: () => void) => {
      setError(undefined);
      setLoading(true);
      set({
        collection: Collections.Pedidos,
        body: order,
        onError: () => {
          setError(errorMessage("ao criar o pedido"));
          setLoading(false);
        },
        onSuccess: () => {
          setSuccess(successMessage("Pedido criado"));
          setLoading(false);
          onCreate();
        },
      });
    },
    [set, setError, setLoading, setSuccess]
  );

  const getSingleOrder = useCallback(
    (id: string) => {
      setError(undefined);
      setLoading(true);
      getBy({
        id: id,
        transformer: createOrder,
        onData: (data) => {
          setSelectedOrder(createOrder(data));
          setLoading(false);
        },
        onError: () => {
          setError(errorMessage("ao obter o pedido selecionado"));
          setLoading(false);
        },
        collection: Collections.Pedidos,
      });
    },
    [getBy, setError, setLoading, setSelectedOrder]
  );

  const listenToOrders = useCallback(
    async (isStoreOpen?: boolean) => {
      if (isStoreOpen !== undefined) {
        if (!isStoreOpen) {
          setOrders([]);
          return;
        }

        setError(undefined);
        setLoading(true);
        return getRealtime({
          onData: (data) => {
            if (!data) return;
            setOrders(
              data.map((o: Order) => createOrder(o, o.isViewed, o.status))
            );
            setLoading(false);
          },
          onError: () => {
            setError(errorMessage("ao obter os pedidos"));
            setLoading(false);
          },
          collection: Collections.Pedidos,
        });
      }
    },
    [getRealtime, setError, setLoading, setOrders]
  );

  const updateOrderStatus = useCallback(
    async (
      status: OrderStatus,
      order?: Order,
      onUpdate?: (order: Order) => void
    ) => {
      setError(undefined);
      setLoading(true);
      if (order !== undefined) {
        await set({
          onSuccess: () => {
            const updatedOrder = createOrder(order.toJson(), true, status);
            setSelectedOrder(updatedOrder);
            if (onUpdate) onUpdate(updatedOrder);
            setLoading(false);
          },
          onError: () => {
            setError(errorMessage("ao atualizar o estado do pedido"));
          },
          collection: Collections.Pedidos,
          body: createOrder(order.toJson(), true, status),
        });
      } else {
        throw Error("Order cannot be null.");
      }
      if (order) getSingleOrder(order.id);
    },
    [getSingleOrder, set, setError, setLoading, setSelectedOrder]
  );

  const deleteOrder = useCallback(
    (id: string) => {
      remove({
        data: orders,
        onData: (data) =>
          setOrders(
            data.map((o: Order) => createOrder(o, o.isViewed, o.status))
          ),
        onSuccess: () => setError(undefined),
        id,
        onError: () => setError(errorMessage("ao remover o pedido")),
        collection: Collections.Pedidos,
      });
    },
    [orders, remove, setError, setOrders]
  );

  const setInvoice = useCallback(
    async (order: Order) => {
      setLoading(true);
      await set({
        collection: Collections.Pedidos_Faturados,
        body: order,
        onError: () => setError(errorMessage("ao faturar o pedido finalizado")),
        onSuccess: () => deleteOrder(order.id),
      });
      setLoading(false);
    },
    [deleteOrder, set, setError, setLoading]
  );

  return {
    loading,
    updateOrderStatus,
    getSingleOrder,
    listenToOrders,
    deleteOrder,
    setInvoice,
    createNewOrder,
    success,
    error,
  };
}
