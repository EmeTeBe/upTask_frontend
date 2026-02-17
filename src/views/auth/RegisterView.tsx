import { useForm } from "react-hook-form";
import type { UserRegistrationForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "@/services/AuthAPI";
import { toast } from "react-toastify";

export default function RegisterView() {
  const initialValues: UserRegistrationForm = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: createAccount,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset();
    },
  });

  const password = watch("password");

  const handleRegister = (formData: UserRegistrationForm) => mutate(formData);

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-black text-center text-white">
        Crear Cuenta
      </h1>
      <p className="text-sm sm:text-lg lg:text-xl font-light text-center text-white mt-3">
        Llena el formulario para {""}
        <span className=" text-fuchsia-500 font-bold"> crear tu cuenta</span>
      </p>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="space-y-3 md:space-y-4 p-6 md:p-10 bg-white mt-6 md:mt-10 rounded"
        noValidate
      >
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
        {errors.password_confirmation && (
          <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
        )}
        <div className="flex flex-col gap-2 md:gap-3">
          <label className="font-normal text-base md:text-lg lg:text-2xl" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className={
              errors.email
                ? "w-full p-2 md:p-3 bg-white/70 border-red-400 rounded border outline-none text-sm md:text-base"
                : "w-full p-2 md:p-3 border-gray-300 border rounded text-sm md:text-base"
            }
            {...register("email", {
              required: "El Email de registro es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
        </div>

        <div className="flex flex-col gap-2 md:gap-3">
          <label className="font-normal text-base md:text-lg lg:text-2xl">Nombre</label>
          <input
            type="name"
            placeholder="Nombre de Registro"
            className={
              errors.name
                ? "w-full p-2 md:p-3 bg-white/70 border-red-400 rounded border outline-none text-sm md:text-base"
                : "w-full p-2 md:p-3 border-gray-300 border rounded text-sm md:text-base"
            }
            {...register("name", {
              required: "El Nombre de usuario es obligatorio",
            })}
          />
        </div>

        <div className="flex flex-col gap-2 md:gap-3">
          <label className="font-normal text-base md:text-lg lg:text-2xl">Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className={
              errors.password
                ? "w-full p-2 md:p-3 bg-white/70 border-red-400 rounded border outline-none text-sm md:text-base"
                : "w-full p-2 md:p-3 border-gray-300 border rounded text-sm md:text-base"
            }
            {...register("password", {
              required: "La constraseña es obligatoria",
              minLength: {
                value: 8,
                message: "La contraseña debe ser mínimo de 8 caracteres",
              },
            })}
          />
        </div>

        <div className="flex flex-col gap-2 md:gap-3">
          <label className="font-normal text-base md:text-lg lg:text-2xl">Repetir Password</label>

          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite Password de Registro"
            className={
              errors.password_confirmation
                ? "w-full p-2 md:p-3 bg-white/70 border-red-400 rounded border outline-none text-sm md:text-base"
                : "w-full p-2 md:p-3 border-gray-300 border rounded text-sm md:text-base"
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
          value="Registrarme"
          className="bg-fuchsia-500 hover:bg-fuchsia-700 w-full p-2 md:p-3 text-white font-bold text-sm md:text-lg lg:text-xl rounded cursor-pointer"
        />
      </form>
      <nav className="mt-6 md:mt-10 flex flex-col space-y-2 md:space-y-4">
        <Link
          to={"/auth/login"}
          className="text-center text-gray-300 font-normal text-xs md:text-sm"
        >
          ¿Ya tienes una cuenta? Inicia sesión
        </Link>
        <Link
          to={"/auth/forgot-password"}
          className="text-center text-gray-300 font-normal text-xs md:text-sm"
        >
          ¿Olvidaste tu constraseña? Reestablecer
        </Link>
      </nav>
    </div>
  );
}
