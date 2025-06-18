import { ChangeEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { form, formFields, saveButton } from "./style.css";

import { Category } from "@/helpers/firestore/model/product/category";
import { CurrencyInput } from "react-currency-mask";
import Dropdown from "@/components/basis/Dropdown";
import DropdownItem from "@/components/basis/Dropdown/DropdownItem";
import ImagePicker from "@/components/basis/ImagePicker";
import InputText from "@/components/basis/InputText/InputText";
import LoadingContainer from "@/components/basis/LoadingContainer";
import { Product } from "@/helpers/firestore/model/product/product";
import RoundedButton from "@/components/basis/Button/RoundedButton";
import useCategories from "./hooks/useCategories";

interface ProductFormProps {
  defaultValue?: Product | null;
  onSubmit: (product: Product, category: Category, file?: File) => void;
  loading: boolean;
  error: string | null;
}

export default function ProductForm({
  onSubmit,
  defaultValue,
  loading,
  error,
}: ProductFormProps) {
  const [image, setImage] = useState<string | undefined>(defaultValue?.image);
  const [binaryImage, setBinaryImage] = useState<File | undefined>(undefined);

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      setBinaryImage(event.target.files[0]);
    }
  };

  const {
    categories,
    error: categoriesError,
    loading: categoriesLoading,
  } = useCategories();

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = useForm<Product>({
    defaultValues: {
      id: "",
      value: 0,
      inventory: 0,
    },
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (defaultValue !== null && defaultValue !== undefined) {
      const { id, category, description, image, value, inventory } =
        defaultValue;

      reset({ id, category, description, image, value, inventory });

      setImage(image);
    }
  }, [defaultValue, reset]);

  const submit = () =>
    handleSubmit(({ id, category, description, value, inventory }, event) => {
      event?.preventDefault();
      if (
        Object.entries(errors).find(([_, value]) => value.message !== undefined)
      )
        return;

      const c = categories.find((c) => c.id === category.id);

      if (!c) return;

      onSubmit(
        new Product(id, description, value, c, inventory, image),
        c,
        binaryImage
      );
      reset();
    });

  return (
    <LoadingContainer
      loading={loading || categoriesLoading}
      error={error !== null || categoriesError !== null}
    >
      <form onSubmit={submit()} className={form}>
        <ImagePicker
          defaultImage={defaultValue?.image}
          placeholder="Selecione a imagem do produto"
          onChange={handleImage}
        />

        <div className={formFields}>
          <Controller
            control={control}
            name="id"
            render={({ field }) => (
              <InputText
                readOnly={defaultValue !== null && defaultValue !== undefined}
                {...field}
                value={field.value}
                onChange={(e) =>
                  field.onChange(e.target.value.replace(/\s/g, ""))
                }
                id="id"
                error={errors.id?.message !== undefined}
                label="Código"
              />
            )}
          />
          <InputText
            {...register("description", {
              required: "The product must have a valid description",
            })}
            id="descricao"
            error={errors.description?.message !== undefined}
            label="Descrição"
          />
          <Controller
            control={control}
            name="inventory"
            render={({ field }) => (
              <InputText
                {...field}
                value={field.value}
                onChange={(e) =>
                  field.onChange(e.target.value.replace(/\D/g, ""))
                }
                id="estoque"
                label="Estoque"
                type="number"
              />
            )}
          />
          <Controller
            control={control}
            name="value"
            rules={{
              min: 0.01,
            }}
            render={({ field }) => (
              <CurrencyInput
                {...field}
                onChangeValue={(_, value) => {
                  field.onChange(value);
                }}
                InputElement={
                  <InputText
                    id="valor"
                    error={errors.value?.message !== undefined}
                    label="Valor"
                    mask="R$ "
                  />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="category"
            defaultValue={categories[0]}
            render={({ field }) => (
              <Dropdown
                {...field}
                id="categoria"
                label="Categoria"
                name="Categoria"
                value={field.value?.id}
                onChange={(selectedValue) => {
                  const selectedCategory = categories.find(
                    (c) => c.id === selectedValue.target.value
                  );
                  if (selectedCategory) {
                    field.onChange(selectedCategory); // Update form value with Category object
                  }
                }}
              >
                {categories.map(({ id, name }) => (
                  <DropdownItem key={id} value={id}>
                    {name}
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          />
          <RoundedButton type="submit" className={saveButton}>
            Salvar
          </RoundedButton>
        </div>
      </form>
    </LoadingContainer>
  );
}
