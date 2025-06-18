import { useCallback, useState } from "react";

import { Collections } from "@/helpers/firestore/collections";
import useFirebase from "@/helpers/firestore/hooks/useFirebase";
import { BaseModel } from "@/helpers/firestore/model/baseModel";
import { errorMessage } from "@/utils/texts";

export class StoreStatus implements BaseModel {
  constructor(id: string, storeStatus: boolean) {
    this.id = id;
    this._storeStatus = storeStatus;
  }

  id: string;

  private readonly _storeStatus: boolean;
  get storeStatus(): boolean {
    return this._storeStatus;
  }

  toJson() {
    return {
      id: this.id,
      storeStatus: this.storeStatus,
    };
  }
}

export default function useStoreStatus() {
  const { set, getBy, getRealtime } = useFirebase();
  const [storeStatus, setStoreStatus] = useState<StoreStatus | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const changeStoreStatus = useCallback(
    async (value: StoreStatus) => {
      setLoading(true);
      await set({
        onSuccess: () => {
          setStoreStatus(value);
          setLoading(false);
        },
        onError: () => {
          setError(errorMessage("ao definir o estado da loja"));
          setLoading(false);
        },
        collection: Collections.Status_Loja,
        body: value,
      });
    },
    [set]
  );

  const listenToStoreStatus = useCallback(() => {
    getRealtime({
      onData: async (data) => {
        if (data) {
          setStoreStatus(new StoreStatus(data.id, data.storeStatus));
        } else {
          await changeStoreStatus(new StoreStatus("storeStatus", true));
        }
        setLoading(false);
      },
      onError: () => {
        setError(errorMessage("ao obter o estado da loja"));
        setLoading(false);
      },
      collection: Collections.Status_Loja,
    });
  }, [changeStoreStatus, getRealtime]);

  const getStoreStatus = useCallback(() => {
    setLoading(true);
    getBy({
      transformer: (data) => new StoreStatus(data.id, data.storeStatus),
      id: "storeStatus",
      onData: async (data) => {
        if (!data) {
          const initialStatus = new StoreStatus("storeStatus", true);
          await changeStoreStatus(initialStatus);
          setStoreStatus(initialStatus);
        } else {
          setStoreStatus(data);
        }
        setLoading(false);
      },
      onError: () => {
        setError(errorMessage("ao obter o estado da loja"));
        setLoading(false);
      },
      collection: Collections.Status_Loja,
    });
  }, [changeStoreStatus, getBy]);

  return {
    storeStatus,
    loading,
    error,
    changeStoreStatus,
    getStoreStatus,
    listenToStoreStatus,
  };
}
