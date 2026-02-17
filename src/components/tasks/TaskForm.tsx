import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { TaskFormData } from "@/types/index";
import ErrorMessage from "../ErrorMessage";

type TaskFormProps = {
  errors: FieldErrors<TaskFormData>;
  register: UseFormRegister<TaskFormData>;
};

export default function TaskForm({ errors, register }: TaskFormProps) {
  return (
    <>
      {errors.taskName && (
        <ErrorMessage>{errors.taskName.message}</ErrorMessage>
      )}
      {errors.description && (
        <ErrorMessage>{errors.description.message}</ErrorMessage>
      )}
      <div className="flex flex-col gap-2">
        <label className="font-normal text-base md:text-lg lg:text-2xl text-slate-800" htmlFor="name">
          Nombre de la tarea
        </label>
        <input
          id="name"
          type="text"
          placeholder="Nombre de la tarea"
          className={
            errors.taskName
              ? "w-full p-2 md:p-3 bg-white/70 border-red-400 rounded border outline-none text-sm md:text-base"
              : "w-full p-2 md:p-3 bg-white/70 border border-slate-600 rounded text-sm md:text-base"
          }
          {...register("taskName", {
            required: "El nombre de la tarea es obligatorio",
          })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="font-normal text-base md:text-lg lg:text-2xl text-slate-800"
          htmlFor="description"
        >
          Descripción de la tarea
        </label>
        <textarea
          id="description"
          placeholder="Descripción de la tarea"
          className={
            errors.description
              ? "w-full p-2 md:p-3 bg-white/70 border-red-400 rounded border outline-none text-sm md:text-base"
              : "w-full p-2 md:p-3 bg-white/70 border border-slate-600 rounded text-sm md:text-base"
          }
          {...register("description", {
            required: "La descripción de la tarea es obligatoria",
          })}
        />
      </div>
    </>
  );
}
