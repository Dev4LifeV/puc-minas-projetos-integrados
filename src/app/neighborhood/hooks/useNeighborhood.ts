import { errorMessage, successMessage } from "@/utils/texts";
import { useCallback, useEffect, useState } from "react";

import { Collections } from "@/helpers/firestore/collections";
import Neighborhood from "@/helpers/firestore/model/neighborhood/neighborhood";
import useFirebase from "@/helpers/firestore/hooks/useFirebase";

export default function useNeighborhood() {
  const { set, get, remove } = useFirebase();

  const [error, setError] = useState<string | null>(null);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const collection = Collections.Bairros;

  const getNeighborhoods = useCallback(async () => {
    setError(null);
    setLoading(true);
    await get({
      collection: collection,
      transformer: (data) =>
        new Neighborhood(data.id, data.neighborhoodName, data.freightCost),
      onData: (neighborhoods) => {
        setNeighborhoods(neighborhoods);
        setLoading(false);
      },
      onError: () => {
        setError(errorMessage("ao obter os bairros"));
        setLoading(false);
      },
    });
  }, [collection, get]);

  useEffect(() => {
    getNeighborhoods();
  }, [getNeighborhoods]);

  const setNeighborhood = async (neighborhood: Neighborhood) => {
    setError(null);
    setLoading(true);
    await set({
      collection: collection,
      onError: () => {
        setError(errorMessage("ao cadastrar bairro"));
        setLoading(false);
      },
      onSuccess: () => {
        setSuccess(successMessage("Bairro cadastrado"));
        setNeighborhoods((n) => [...n, neighborhood]);
        setLoading(false);
      },
      body: neighborhood,
    });
  };

  const removeNeighborhood = async (id: string) => {
    setError(null);
    setLoading(true);
    await remove({
      collection: collection,
      id,
      data: neighborhoods,
      onData: setNeighborhoods,
      onError: () => {
        setError(errorMessage("ao remover o bairro"));
        setLoading(false);
      },
      onSuccess: () => {
        setSuccess(successMessage("Bairro removido"));
        setLoading(false);
      },
    });
  };

  return {
    setNeighborhood,
    removeNeighborhood,
    loading,
    error,
    success,
    neighborhoods,
  };
}
