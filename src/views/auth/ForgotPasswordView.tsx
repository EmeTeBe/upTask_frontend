import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import type { RequestConfirmationCodeForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { forgotPassword } from "@/services/AuthAPI";

export default function RegisterView() {
  const initialValues: RequestConfirmationCodeForm = {
    email: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestConfirmationCodeForm>({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: forgotPassword,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset();
    },
  });

  const handleRequestCode = (formData: RequestConfirmationCodeForm) =>
    mutate(formData);

  return (
    <div>
      <h1 className="text-5xl font-bold text-white text-center">
        Reestablecer contraseña
      </h1>
      <p className="text-2xl font-light text-white mt-5 text-center">
        ¿Olvidaste tu contraseña? Coloca tu e-mail para{" "}
        <span className=" text-fuchsia-500 font-bold">
          reestablecer contaseña
        </span>
      </p>

      <form
        onSubmit={handleSubmit(handleRequestCode)}
        className="space-y-8 p-10 rounded-lg bg-white mt-10"
        noValidate
      >
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        <div className="flex flex-col gap-3">
          <label className="font-normal text-2xl" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className={
              errors.email
                ? "w-full p-3 rounded-lg border-red-400 border outline-none"
                : "w-full p-3 rounded-lg border-gray-300 border"
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

        <input
          type="submit"
          value="Enviar Código"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer"
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/login"
          className="text-center text-gray-300 font-normal"
        >
          ¿Ya tienes cuenta? Iniciar Sesión
        </Link>
        <Link
          to={"/auth/register"}
          className="text-center text-gray-300 font-normal"
        >
          ¿No tienes cuenta? Crea Una
        </Link>
      </nav>
    </div>
  );
}
