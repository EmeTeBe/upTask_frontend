import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import type { ConfirmToken, NewPasswordForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { updatePasswordWithToken } from "@/services/AuthAPI";
import { toast } from "react-toastify";

type NewPasswordFormProps = {
  token: ConfirmToken["token"];
};

export default function NewPasswordForm({ token }: NewPasswordFormProps) {
  const navigate = useNavigate();
  const initialValues: NewPasswordForm = {
    password: "",
    password_confirmation: "",
  };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: updatePasswordWithToken,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset();
      navigate("/auth/login");
    },
  });

  const handleNewPassword = (formData: NewPasswordForm) => {
    const data = {
      formData,
      token,
    };
    mutate(data);
  };

  const password = watch("password");

  return (
    <div>
      <form
        onSubmit={handleSubmit(handleNewPassword)}
        className="space-y-5 p-10 bg-white mt-10 rounded"
        noValidate
      >
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
        {errors.password_confirmation && (
          <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
        )}
        <div className="flex flex-col gap-3">
          <label className="font-normal text-2xl">Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className={
              errors.password
                ? "w-full p-3 bg-white/70 border-red-400 rounded border outline-none"
                : "w-full p-3 bg-white/70 border border-slate-600 rounded"
            }
            {...register("password", {
              required: "El Password es obligatorio",
              minLength: {
                value: 8,
                message: "El Password debe ser mínimo de 8 caracteres",
              },
            })}
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-normal text-2xl">Repetir Password</label>

          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite Password de Registro"
            className={
              errors.password_confirmation
                ? "w-full p-3 bg-white/70 border-red-400 rounded border outline-none"
                : "w-full p-3 bg-white/70 border border-slate-600 rounded"
            }
            {...register("password_confirmation", {
              required: "Repetir Password es obligatorio",
              validate: (value) =>
                value === password || "Los Passwords no son iguales",
            })}
          />
        </div>

        <input
          type="submit"
          value="Establecer Password"
          className="bg-fuchsia-500 hover:bg-fuchsia-700 w-full p-3 mt-2 text-white font-bold rounded text-xl cursor-pointer"
        />
      </form>
    </div>
  );
}
