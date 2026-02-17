import { useForm } from "react-hook-form";
import type { UserLoginForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/AuthAPI";
import { toast } from "react-toastify";

export default function LoginView() {
  const initialValues: UserLoginForm = {
    email: "",
    password: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: login,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Sesión iniciada correctamente");
      reset();
      navigate("/");
    },
  });

  const handleLogin = (formData: UserLoginForm) => mutate(formData);

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center">
        Iniciar sesión
      </h1>
      <p className="text-base sm:text-lg lg:text-2xl font-light text-white mt-4 md:mt-5 text-center">
        Comienza a planear tus proyectos{" "}
        <span className=" text-fuchsia-500 font-bold">
          iniciando sesión en este formulario
        </span>
      </p>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-4 p-6 md:p-10 bg-white rounded mt-6 md:mt-10"
        noValidate
      >
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-normal text-base md:text-lg lg:text-2xl">
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
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-normal text-base md:text-lg lg:text-2xl">
            Password
          </label>

          <input
            type="password"
            placeholder="Password de Registro"
            className={
              errors.password
                ? "w-full p-2 md:p-3 bg-white/70 border-red-400 rounded border outline-none text-sm md:text-base"
                : "w-full p-2 md:p-3 border-gray-300 border rounded text-sm md:text-base"
            }
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
        </div>

        <input
          type="submit"
          value="Iniciar Sesión"
          className="bg-fuchsia-500 hover:bg-fuchsia-700 w-full p-2 md:p-3 mt-3 text-white font-bold text-sm md:text-lg lg:text-xl rounded cursor-pointer"
        />
      </form>
      <nav className="mt-6 md:mt-10 flex flex-col space-y-3 md:space-y-4">
        <Link
          to={"/auth/register"}
          className="text-center text-gray-300 font-normal text-xs md:text-sm"
        >
          ¿No tienes cuenta? Crea Una
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
