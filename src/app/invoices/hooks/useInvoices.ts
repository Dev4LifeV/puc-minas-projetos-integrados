import { useCallback, useState } from "react";

import Address from "@/helpers/firestore/model/order/address";
import { Collections } from "@/helpers/firestore/collections";
import Item from "@/helpers/firestore/model/order/item";
import Neighborhood from "@/helpers/firestore/model/neighborhood/neighborhood";
import Order from "@/helpers/firestore/model/order/order";
import { Product } from "@/helpers/firestore/model/product/product";
import { errorMessage } from "@/utils/texts";
import useFirebase from "@/helpers/firestore/hooks/useFirebase";

export default function useInvoices() {
  const { get, getBy } = useFirebase<Order>();

  const [error, setError] = useState<string | undefined>(undefined);
  const [orders, setOrders] = useState<Order[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const collection = Collections.Pedidos_Faturados;

  const transformer = (data: any) =>
    new Order(
      data?.id,
      data?.isViewed,
      data?.orderIssuer,
      data.address &&
        new Address(
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
        ),
      data?.items.map(
        (content: any) =>
          new Item(
            content.id,
            new Product(
              content.product.id,
              content.product.description,
              content.product.value,
              content.product.category,
              content.product.inventory,
              content.product.image
            ),
            content.quantity,
            content.value
          )
      ),
      data?.phoneNumber,
      new Date(data?.createdOn),
      data.status,
      data?.paymentMethod,
      data?.uidOrderIssuer,
      data?.notes ?? ""
    );

  const getInvoices = useCallback(() => {
    setError(undefined);
    setLoading(true);
    get({
      collection,
      onData: (orders) => {
        setOrders(orders);
        setLoading(false);
      },
      onError: () => {
        setError(errorMessage("ao obter os pedidos faturados."));
        setLoading(false);
      },
      transformer,
    });
  }, [collection, get]);

  const getInvoice = useCallback(
    (id: string) => {
      setError(undefined);
      setLoading(true);
      getBy({
        collection,
        id,
        onData: (order) => {
          setSelectedOrder(order);
          setLoading(false);
        },
        onError: () => {
          setError(errorMessage("ao obter o pedido faturado selecionado."));
          setLoading(false);
        },
        transformer,
      });
    },
    [collection, getBy]
  );

  return { getInvoice, getInvoices, orders, error, loading, selectedOrder };
}
