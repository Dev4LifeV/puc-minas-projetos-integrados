import { useEffect, useState } from "react";

import { Collections } from "@/helpers/firestore/collections";
import useFirebase from "@/helpers/firestore/hooks/useFirebase";
import { Category } from "@/helpers/firestore/model/product/category";
import { errorMessage } from "@/utils/texts";

export default function useCategories() {
  const { get } = useFirebase();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    get({
      collection: Collections.Categorias,
      onData: (categories) => {
        setCategories(categories);
        setLoading(false);
      },
      onError: () => {
        setError(errorMessage("ao obter as categorias."));
        setLoading(false);
      },
      transformer: (data) => new Category(data.id, data.name),
    });
  }, [get]);

  return { categories, loading, error };
}
