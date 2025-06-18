"use client";

import "./style.css"; // Assuming this is necessary

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import LoadingContainer from "@/components/basis/LoadingContainer";
import { OrderContext } from "../context/OrderContext";
import { OrderStatus } from "@/helpers/firestore/enum/order-status";
import SelectedOrderDetails from "../../../components/shared/SelectedOrderDetails";
import useOrders from "../hooks/useOrders";
import useSetProduct from "@/app/products/hooks/useSetProduct";

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const {
    updateOrderStatus,
    getSingleOrder,
    setInvoice,
    deleteOrder,
    createNewOrder,
  } = useOrders();
  const { save, loading: loadingProduct } = useSetProduct();
  const router = useRouter();
  const { loading, error, selectedOrder, setSelectedOrder } =
    useContext(OrderContext);
  const autoPrintInitiatedRef = useRef(false);
  const [loadingCancelOrder, setLoadingCancelOrder] = useState(false);

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    setLoadingCancelOrder(true);

    deleteOrder(selectedOrder.id);

    if (!loading) {
      await Promise.allSettled(
        selectedOrder.items.map(async (item) => {
          await save(item.product, item.product.category);
        })
      );
    }

    setLoadingCancelOrder(false);
    router.replace("/orders");
  };

  const updateOrder = useCallback(
    ({ autoPrint = false }: { autoPrint?: boolean }) => {
      if (selectedOrder) {
        selectedOrder.isViewed = true;
      }

      if (autoPrint) {
        window.print();
      }
    },
    [selectedOrder]
  );

  const onUpdateStatus = useCallback(
    async (status: OrderStatus) => {
      if (!selectedOrder) {
        return;
      }

      if (status == OrderStatus.picking) {
        updateOrder({});
        updateOrderStatus(status, selectedOrder);
      } else if (status == OrderStatus.sent) {
        const isTakeoutOrder =
          selectedOrder.status === OrderStatus.new && !selectedOrder.address;

        let autoPrint = false;

        if (isTakeoutOrder) {
          // This is the specific scenario for take-out orders automatically moving to sent.
          // We use a ref to ensure printing happens only once for this auto-transition attempt.
          if (!autoPrintInitiatedRef.current) {
            autoPrint = true;
            autoPrintInitiatedRef.current = true; // Mark that printing is initiated for this auto-flow.
          }
        } else {
          // For any other transition to 'sent' (e.g., from 'picking', or a manual action),
          // print if the order wasn't already in 'sent' status.
          if (selectedOrder.status !== OrderStatus.sent) {
            autoPrint = true;
          }
        }
        updateOrder({ autoPrint });
        updateOrderStatus(status, selectedOrder);
      } else if (status === OrderStatus.delivered) {
        if (selectedOrder) {
          await updateOrderStatus(
            status,
            selectedOrder,
            async (updatedOrder) => {
              await setInvoice(updatedOrder);
              router.back();
            }
          );
        }
      }
    },
    // autoPrintInitiatedRef is stable and doesn't need to be in dependencies
    [router, selectedOrder, setInvoice, updateOrder, updateOrderStatus]
  );

  useEffect(() => {
    getSingleOrder(id);
    // Reset the flag when a new order is loaded or component mounts for a specific order ID.
    autoPrintInitiatedRef.current = false;
  }, [getSingleOrder, id]);

  useEffect(() => {
    if (selectedOrder) {
      // Only attempt automatic status transitions if the order is currently 'new'.
      if (selectedOrder.status === OrderStatus.new) {
        const isTakeOut = !selectedOrder.address;

        if (isTakeOut) {
          // New order WITHOUT address (take-out)
          // The onUpdateStatus logic will use autoPrintInitiatedRef to control printing.
          onUpdateStatus(OrderStatus.sent);
        } else {
          // New order WITH an address
          onUpdateStatus(OrderStatus.picking);
        }
      }
      // If selectedOrder.status is not OrderStatus.new, this effect does nothing,
      // preventing loops for orders already processed (e.g., 'picking', 'sent').
    }
  }, [onUpdateStatus, selectedOrder]);

  return (
    <>
      <LoadingContainer
        loading={loading || loadingCancelOrder}
        error={error !== undefined || selectedOrder === undefined}
      >
        {selectedOrder && (
          <SelectedOrderDetails
            onUpdateStatus={onUpdateStatus}
            selectedOrder={selectedOrder}
            onCancelOrder={handleCancelOrder}
            onEditOrder={(order) =>
              createNewOrder(order, () => setSelectedOrder(order))
            }
          />
        )}
      </LoadingContainer>
    </>
  );
}
