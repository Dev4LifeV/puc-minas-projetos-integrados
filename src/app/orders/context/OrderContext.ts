import { createContext } from "react";
import { OrderContextType } from "./OrderContextType";

export const OrderContext = createContext<OrderContextType>({
  loading: false,
  setError: () => {},
  setLoading: () => {},
  setOrders: () => {},
  getStoreStatus: () => {},
  setSelectedOrder: () => {},
  setSuccess: () => {},
});
