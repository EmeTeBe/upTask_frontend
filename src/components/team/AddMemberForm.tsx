import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { TeamMemberForm } from "@/types/index";
import ErrorMessage from "../ErrorMessage";

type AddMemberFormProps = {
  errors: FieldErrors<TeamMemberForm>;
  register: UseFormRegister<TeamMemberForm>;
};

export default function AddMemberForm({
  errors,
  register,
}: AddMemberFormProps) {
  return (
    <>
      {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

      <div className="flex flex-col gap-2">
        <label
          className="font-normal text-base md:text-lg lg:text-2xl text-slate-800"
          htmlFor="name"
        >
          E-mail del usuario
        </label>
        <input
          id="name"
          type="text"
          placeholder="correo@correo.com..."
          autoFocus
          className={
            errors.email
              ? "w-full p-2 md:p-3 bg-white/70 border-red-400 rounded border outline-none text-sm md:text-base"
              : "w-full p-2 md:p-3 bg-white/70 border border-slate-600 rounded text-sm md:text-base"
          }
          {...register("email", {
            required: "El email es obligatorio",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "E-mail no válido",
            },
          })}
        />
      </div>
    </>
  );
}
