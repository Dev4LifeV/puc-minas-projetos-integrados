import { form, formFields, saveButton } from "./style.css";

import RoundedButton from "@/components/basis/Button/RoundedButton";
import InputText from "@/components/basis/InputText/InputText";
import LoadingContainer from "@/components/basis/LoadingContainer";
import { Category } from "@/helpers/firestore/model/product/category";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface CategoryFormProps {
  defaultValue?: Category | null;
  onSubmit: (category: Category) => void;
  loading: boolean;
  error: string | null;
}

export default function CategoryForm({
  onSubmit,
  defaultValue,
  loading,
  error,
}: CategoryFormProps) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<Category>({
    defaultValues: {
      id: Date.now().toString(),
      name: "",
    },
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (defaultValue !== null && defaultValue !== undefined) {
      const { id, name } = defaultValue;

      reset({ id, name });
    }
  }, [defaultValue, reset]);

  const submit = () =>
    handleSubmit(({ id, name }, event) => {
      event?.preventDefault();
      if (
        Object.entries(errors).find(([_, value]) => value.message !== undefined)
      )
        return;

      onSubmit(new Category(id, name));
      reset();
    });

  return (
    <LoadingContainer loading={loading} error={error !== null}>
      <form onSubmit={submit()} className={form}>
        <div className={formFields}>
          <InputText
            {...register("name", {
              required: "The category must have a valid description",
            })}
            id="nome"
            maxLength={24}
            error={errors.name?.message !== undefined}
            label="Nome da categoria"
          />
          <RoundedButton className={saveButton} type="submit">
            Salvar
          </RoundedButton>
        </div>
      </form>
    </LoadingContainer>
  );
}
