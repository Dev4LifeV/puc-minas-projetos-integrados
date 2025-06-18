import {
  Snackbar,
  SnackbarContent,
  Stack,
  Typography,
  colors,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { form, formFields, saveButton } from "./style.css";

import useNeighborhood from "@/app/neighborhood/hooks/useNeighborhood";
import RoundedButton from "@/components/basis/Button/RoundedButton";
import Dropdown from "@/components/basis/Dropdown";
import DropdownItem from "@/components/basis/Dropdown/DropdownItem";
import InputText from "@/components/basis/InputText/InputText";
import LoadingContainer from "@/components/basis/LoadingContainer";
import Neighborhood from "@/helpers/firestore/model/neighborhood/neighborhood";
import Address from "@/helpers/firestore/model/order/address";

interface DeliveryAddressStepProps {
  address: Address | null;
  onSubmit: (address: Address) => void;
}

// Define a type for the form data
type AddressFormData = {
  address: string;
  apt: string;
  neighborhood?: Neighborhood;
  number: string;
  postalCode: string;
  reference: string;
};

export default function DeliveryAddressStep({
  address,
  onSubmit,
}: DeliveryAddressStepProps) {
  const { neighborhoods, error, loading } = useNeighborhood();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: {
      address: "",
      apt: "",
      number: "",
      postalCode: "",
      reference: "",
    },
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (address) {
      // Convert Address instance to plain object for form
      reset({
        address: address.address,
        apt: address.apt,
        neighborhood: address.neighborhood,
        number: address.number,
        postalCode: address.postalCode,
        reference: address.reference,
      });
    }
  }, [reset, address]);

  const formatCEP = (value: string): string => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, "");

    // Apply CEP mask: 00000-000
    if (cleaned.length <= 5) {
      return cleaned;
    }
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
  };

  const submit = () =>
    handleSubmit(
      (
        { address: street, apt, neighborhood, number, postalCode, reference },
        event
      ) => {
        event?.preventDefault();

        if (
          Object.entries(errors).find(
            ([_, value]) => value.message !== undefined
          )
        )
          return;

        const neighborhoodSelected = neighborhoods.find(
          (n) => n.id === neighborhood?.id
        );

        console.log(neighborhood, neighborhoods);

        if (!neighborhoodSelected) return;

        const address = new Address(
          street,
          number,
          apt,
          neighborhoodSelected,
          reference,
          postalCode
        );

        onSubmit(address);
        setOpenSnackbar(true);
      }
    );

  return (
    <LoadingContainer error={error !== null} loading={loading}>
      <Stack>
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            marginBottom: 4,
          }}
        >
          Endereço de entrega
        </Typography>

        <form onSubmit={submit()} className={form}>
          <div className={formFields}>
            <InputText
              {...register("address", {
                required: "The order must have a valid address",
              })}
              id="address"
              error={errors.address?.message !== undefined}
              label="Logradouro"
            />
            <InputText
              {...register("number", {
                required: "The order must have a valid number",
              })}
              id="number"
              error={errors.number?.message !== undefined}
              label="Número"
            />
            <InputText {...register("apt")} id="apt" label="Apt" />

            <Controller
              control={control}
              name="neighborhood"
              defaultValue={neighborhoods[0]}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  id="neighborhood"
                  label="Bairro"
                  name="neighborhood"
                  value={field.value?.id}
                  onChange={(selectedValue) => {
                    const selectedCategory = neighborhoods.find(
                      (n) => n.id === selectedValue.target.value
                    );
                    if (selectedCategory) {
                      field.onChange(selectedCategory); // Update form value with Category object
                    }
                  }}
                >
                  {neighborhoods.map(({ id, neighborhoodName }) => (
                    <DropdownItem key={id} value={id}>
                      {neighborhoodName}
                    </DropdownItem>
                  ))}
                </Dropdown>
              )}
            />

            <Controller
              control={control}
              name="postalCode"
              rules={{
                required: "CEP é obrigatório",
                pattern: {
                  value: /^\d{5}-\d{3}$/,
                  message: "Formato inválido (use 12345-000)",
                },
              }}
              render={({ field }) => (
                <InputText
                  id="postalCode"
                  error={!!errors.postalCode}
                  label="CEP"
                  value={field.value || ""}
                  onChange={(e) => {
                    // Remove non-digits and limit to 8 characters
                    const rawValue = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 8);
                    // Format the value and update form state
                    field.onChange(formatCEP(rawValue));
                  }}
                  maxLength={9}
                  inputMode="numeric" // Show numeric keyboard on mobile
                />
              )}
            />

            <RoundedButton type="submit" className={saveButton}>
              Salvar
            </RoundedButton>
          </div>
        </form>
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <SnackbarContent
            message="Endereço salvo com sucesso."
            style={{
              backgroundColor: colors.blue[500],
            }}
          />
        </div>
      </Snackbar>
    </LoadingContainer>
  );
}
