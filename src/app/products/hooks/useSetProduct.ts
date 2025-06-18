import { errorMessage, successMessage } from "@/utils/texts";

import { Collections } from "@/helpers/firestore/collections";
import useFirebase from "@/helpers/firestore/hooks/useFirebase";
import { Category } from "@/helpers/firestore/model/product/category";
import { Product } from "@/helpers/firestore/model/product/product";
import { Folders } from "@/helpers/storage/folders";
import useStorage from "@/helpers/storage/hooks/useStorage";
import { useCompressImage } from "@/hooks/useCompressImage";
import { useState } from "react";

export default function useSetProduct(isEditing: boolean = false) {
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { set } = useFirebase();
  const { upload } = useStorage(Folders.Produtos);
  const compress = useCompressImage();

  const save = async (product: Product, category: Category, file?: File) => {
    setLoading(true);
    setError(null);

    try {
      if (file) {
        const compressedBlob = await compress(file);

        // Create a proper File from the Blob
        const compressedFile = new File([compressedBlob], file.name, {
          type: compressedBlob.type,
        });

        return await upload({
          id: product.id,
          file: compressedFile,
          onError: () => {
            setError(errorMessage("ao cadastrar imagem do produto."));
            setLoading(false);
          },
          onSuccess: async (imagePath) => {
            const newProduct = new Product(
              product.id,
              product.description,
              product.value,
              category,
              product.inventory,
              imagePath
            );

            await set({
              collection: Collections.Produtos,
              onError: () => {
                setError(
                  errorMessage(
                    isEditing
                      ? "ao atualizar cadastro."
                      : "ao cadastrar produto."
                  )
                );
                setLoading(false);
              },
              onSuccess: () => {
                setSuccess(
                  successMessage(
                    isEditing ? "Produto atualizado" : "Produto cadastrado"
                  )
                );
                setProduct(newProduct);
                setLoading(false);
              },
              body: newProduct,
            });
          },
        });
      }

      // Handle case without file
      const newProduct = new Product(
        product.id,
        product.description,
        product.value,
        category,
        product.inventory,
        product.image
      );

      await set({
        collection: Collections.Produtos,
        onError: () => {
          setError(
            errorMessage(
              isEditing ? "ao atualizar cadastro." : "ao cadastrar produto."
            )
          );
          setLoading(false);
        },
        onSuccess: () => {
          setSuccess(
            successMessage(
              isEditing ? "Produto atualizado" : "Produto cadastrado"
            )
          );
          setProduct(newProduct);
          setLoading(false);
        },
        body: newProduct,
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro desconhecido ao salvar o produto");
      }
      setLoading(false);
    }
  };

  return { product, loading, success, error, save };
}
