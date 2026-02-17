import type { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import type { ProjectFormData } from "@/types/index";

type ProjectFormProps = {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
};

export default function ProjectForm({ register, errors }: ProjectFormProps) {
  return (
    <>
      {errors.projectName && (
        <ErrorMessage>{errors.projectName.message}</ErrorMessage>
      )}
      {errors.clientName && (
        <ErrorMessage>{errors.clientName.message}</ErrorMessage>
      )}
      {errors.description && (
        <ErrorMessage>{errors.description.message}</ErrorMessage>
      )}
      <div className="mb-5 space-y-3">
        <label htmlFor="projectName" className="text-sm uppercase font-bold">
          Nombre del Proyecto
        </label>
        <input
          id="projectName"
          className={
            errors.projectName
              ? `w-full p-3  border border-red-400 rounded outline-none`
              : `w-full p-3  border border-gray-200 rounded`
          }
          type="text"
          placeholder="Nombre del Proyecto"
          {...register("projectName", {
            required: "El Titulo del Proyecto es obligatorio",
          })}
        />
      </div>

      <div className="mb-5 space-y-3">
        <label htmlFor="clientName" className="text-sm uppercase font-bold">
          Nombre Cliente
        </label>
        <input
          id="clientName"
          className={
            errors.clientName
              ? `w-full p-3  border border-red-400 rounded outline-none`
              : `w-full p-3  border border-gray-200 rounded`
          }
          type="text"
          placeholder="Nombre del Cliente"
          {...register("clientName", {
            required: "El Nombre del Cliente es obligatorio",
          })}
        />
      </div>

      <div className="mb-5 space-y-3">
        <label htmlFor="description" className="text-sm uppercase font-bold">
          Descripción
        </label>
        <textarea
          id="description"
          className={
            errors.description
              ? `w-full p-3  border border-red-400 rounded outline-none`
              : `w-full p-3  border border-gray-200 rounded`
          }
          placeholder="Descripción del Proyecto"
          {...register("description", {
            required: "Una descripción del proyecto es obligatoria",
          })}
        />
      </div>
    </>
  );
}
