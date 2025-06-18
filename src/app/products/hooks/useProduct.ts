import { useEffect, useState } from "react";

import { Category } from "@/helpers/firestore/model/product/category";
import { Collections } from "@/helpers/firestore/collections";
import { Product } from "@/helpers/firestore/model/product/product";
import { errorMessage } from "@/utils/texts";
import useFirebase from "@/helpers/firestore/hooks/useFirebase";

export default function useProduct(id: string) {
  const { getBy } = useFirebase();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    getBy({
      id,
      collection: Collections.Produtos,
      onData: (product) => {
        setProduct(product);
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
  }, [getBy, id]);

  return { product, loading, error };
}
