import { errorMessage, successMessage } from "@/utils/texts";

import { Collections } from "@/helpers/firestore/collections";
import useFirebase from "@/helpers/firestore/hooks/useFirebase";
import { Category } from "@/helpers/firestore/model/product/category";
import { useState } from "react";

export default function useSetCategory(isEditing: boolean = false) {
  const [category, setCategory] = useState<Category>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { set } = useFirebase();

  const save = async (category: Category) => {
    setLoading(true);
    setError(null);

    await set({
      collection: Collections.Categorias,
      onError: () => {
        setError(
          errorMessage(
            isEditing ? "ao atualizar cadastro." : "ao cadastrar categoria."
          )
        );
        setLoading(false);
      },
      onSuccess: () => {
        setSuccess(
          successMessage(
            isEditing ? "Categoria atualizada" : "Categoria cadastrada"
          )
        );
        setCategory(category);
        setLoading(false);
      },
      body: category,
    });
  };

  return { category, loading, success, error, save };
}
