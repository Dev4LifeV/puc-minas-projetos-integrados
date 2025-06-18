import { errorMessage, successMessage } from "@/utils/texts";
import { useEffect, useState } from "react";

import { Category } from "@/helpers/firestore/model/product/category";
import { Collections } from "@/helpers/firestore/collections";
import { Folders } from "@/helpers/storage/folders";
import { Product } from "@/helpers/firestore/model/product/product";
import useFirebase from "@/helpers/firestore/hooks/useFirebase";
import useStorage from "@/helpers/storage/hooks/useStorage";

export default function useProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const useReadProducts = () => {
    const { get } = useFirebase();
    useEffect(() => {
      setError(null);
      setLoading(true);
      get({
        collection: Collections.Produtos,
        onData: (products) => {
          setProducts(products);
          setLoading(false);
        },
        onError: () => {
          setError(errorMessage("ao obter os produtos."));
          setLoading(false);
        },
        transformer: (data) =>
          new Product(
            data.id,
            data.description,
            data.value,
            new Category(data.category.id, data.category.name),
            data.inventory,
            data.image
          ),
      });
    }, [get]);
  };

  const useDeleteProducts = () => {
    const { remove: removeFirebase } = useFirebase();
    const { remove: removeStorage } = useStorage(Folders.Produtos);

    const collection = Collections.Produtos;
    const removeProduct = async (id: string) => {
      setError(null);
      setLoading(true);
      removeStorage({
        id: id,
        onError: () => {
          setError(errorMessage("ao remover o produto."));
          setLoading(false);
          return;
        },
        onSuccess: async () => {
          await removeFirebase({
            collection: collection,
            id,
            data: products,
            onData: setProducts,
            onError: () => {
              setError(errorMessage("ao remover o produto."));
              setLoading(false);
            },
            onSuccess: () => {
              setSuccess(successMessage("Produto removido"));
              setLoading(false);
            },
          });
        },
      });
    };

    return { removeProduct };
  };

  return {
    useReadProducts,
    useDeleteProducts,
    loading,
    error,
    products,
    success,
  };
}
