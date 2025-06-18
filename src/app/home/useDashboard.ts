import { useEffect, useState } from "react";

import Address from "@/helpers/firestore/model/order/address";
import { Category } from "@/helpers/firestore/model/product/category";
import { Collections } from "@/helpers/firestore/collections";
import Item from "@/helpers/firestore/model/order/item";
import Neighborhood from "@/helpers/firestore/model/neighborhood/neighborhood";
import Order from "@/helpers/firestore/model/order/order";
import { Product } from "@/helpers/firestore/model/product/product";
import useFirebase from "@/helpers/firestore/hooks/useFirebase";
import { where } from "firebase/firestore";

export default function useDashboard(onError: () => void) {
  const { getRawQuery } = useFirebase();

  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalIncome: 0,
    avgTicket: 0,
  });

  const createOrder = (data: any) => {
    return new Order(
      data?.id,
      data?.isViewed,
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
            content.id,
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
            content.value,
            content?.notes ?? ""
          )
      ),
      data?.phoneNumber,
      new Date(data?.createdOn),
      data.status,
      data?.paymentMethod,
      data?.uidOrderIssuer
    );
  };

  useEffect(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0);
    startOfDay.setMinutes(0);
    startOfDay.setSeconds(0);
    startOfDay.setMilliseconds(0);

    const endOfDay = new Date();
    endOfDay.setHours(23);
    endOfDay.setMinutes(59);
    endOfDay.setSeconds(59);
    endOfDay.setMilliseconds(0);

    const formatDate = (date: Date) => {
      return date
        .toISOString()
        .replace("Z", "")
        .replace(/\.\d{3}/, (match) => match + "000");
    };

    const startDateString = formatDate(startOfDay);
    const endDateString = formatDate(endOfDay);

    getRawQuery({
      collection: Collections.Pedidos_Faturados,
      filter: [
        where("createdOn", ">=", startDateString),
        where("createdOn", "<=", endDateString),
      ],
      onData: (data) => {
        console.log("data", data);

        if (!data) return;

        const orders = data.map(createOrder);

        let total = 0;

        orders.forEach((o) => {
          total += o.items.reduce((total, i) => i.value + total, 0);
        });

        setDashboardData((prev) => ({
          totalIncome: prev.totalIncome + total,
          totalOrders: orders.length,
          avgTicket: isNaN((prev.totalIncome + total) / orders.length)
            ? 0
            : (prev.totalIncome + total) / orders.length,
        }));
      },
      onError: onError,
    });
  }, [getRawQuery, onError]);

  return dashboardData;
}
