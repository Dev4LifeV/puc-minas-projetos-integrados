import InputText from "@/components/basis/InputText/InputText";
import { User } from "@/helpers/firestore/model/admin/user";
import Check from "@icons/Check";
import { IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { emailVerificationRegex } from "../../../constants";
import { userForm } from "./style.css";

type NewUserFormType = {
  email: string;
  name: string;
};

interface NewUserFormProps {
  onSubmit: (user: User) => void;
}

export default function NewUserForm({ onSubmit }: NewUserFormProps) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<NewUserFormType>({
    reValidateMode: "onChange",
  });

  return (
    <form
      autoComplete="new-password"
      onSubmit={handleSubmit(({ email, name }) => {
        if (emailVerificationRegex.test(email) && name.length > 0) {
          onSubmit(new User(email, email, name));
          reset();
        }
      })}
      className={userForm}
    >
      <InputText
        label="E-mail do usuário"
        {...register("email", {
          required: "Must be an valid email address",
          validate: (value) => emailVerificationRegex.test(value),
        })}
        error={errors.email?.message !== undefined}
      />
      <InputText
        label="Nome do usuário"
        {...register("name", {
          required: "Name is required",
        })}
        error={errors.name?.message !== undefined}
      />

      <IconButton type="submit">
        <Check fontSize={35} />
      </IconButton>
    </form>
  );
}
