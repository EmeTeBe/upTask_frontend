import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import type { UpdateCurrentPasswordForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/services/ProfileAPI";
import { toast } from "react-toastify";

export default function ChangePasswordView() {
  const initialValues: UpdateCurrentPasswordForm = {
    currentPassword: "",
    password: "",
    password_confirmation: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate: updatePasswordMutate } = useMutation({
    mutationFn: changePassword,
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => toast.success(data),
  });

  const password = watch("password");

  const handleChangePassword = (formData: UpdateCurrentPasswordForm) => {
    updatePasswordMutate(formData);
  };

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-5xl font-black ">Cambiar Password</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Utiliza este formulario para cambiar tu password
        </p>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className=" mt-14 space-y-5 bg-white shadow-lg p-10 rounded-lg"
          noValidate
        >
          {errors.currentPassword && (
            <ErrorMessage>{errors.currentPassword.message}</ErrorMessage>
          )}
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="currentPassword"
            >
              Contraseña Actual
            </label>
            <input
              id="currentPassword"
              type="password"
              placeholder="Contraseña Actual..."
              autoFocus
              className={
                errors.currentPassword
                  ? "w-full p-3 bg-white/70 border-red-400 rounded border outline-none"
                  : "w-full p-3 bg-white/70 border border-slate-600 rounded"
              }
              {...register("currentPassword", {
                required: "La contraseña actual es obligatoria",
              })}
            />
          </div>

          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="password">
              Nueva Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Nueva Contraseña..."
              className={
                errors.password
                  ? "w-full p-3 bg-white/70 border-red-400 rounded border outline-none"
                  : "w-full p-3 bg-white/70 border border-slate-600 rounded"
              }
              {...register("password", {
                required: "La nueva contraseña es obligatoria",
                minLength: {
                  value: 8,
                  message: "La contraseña debe ser mínimo de 8 caracteres",
                },
              })}
            />
          </div>
          <div className="mb-5 space-y-3">
            <label
              htmlFor="password_confirmation"
              className="text-sm uppercase font-bold"
            >
              Repetir Contraseña
            </label>

            <input
              id="password_confirmation"
              type="password"
              placeholder="Repetir Contraseña..."
              className={
                errors.password_confirmation
                  ? "w-full p-3 bg-white/70 border-red-400 rounded border outline-none"
                  : "w-full p-3 bg-white/70 border border-slate-600 rounded"
              }
              {...register("password_confirmation", {
                required: "Repetir contraseña es obligatorio",
                validate: (value) =>
                  value === password || "Las contraseñas no son iguales",
              })}
            />
          </div>

          <input
            type="submit"
            value="Cambiar Contraseña"
            className="bg-fuchsia-600 w-full p-3 text-white uppercase shadow-inner shadow-white/60 font-bold hover:bg-fuchsia-700 cursor-pointer transition-colors rounded"
          />
        </form>
      </div>
    </>
  );
}
