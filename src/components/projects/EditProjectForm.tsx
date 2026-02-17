import { Link, useNavigate } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import type { Project, ProjectFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "@/services/ProjectAPI";
import { toast } from "react-toastify";

type EditProjectFormProps = {
  data: ProjectFormData;
  projectId: Project["_id"];
};

export default function EditProjectForm({
  data,
  projectId,
}: EditProjectFormProps) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: data.projectName,
      clientName: data.clientName,
      description: data.description,
    },
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
      toast.success(data);
      navigate("/");
    },
  });

  const handleForm = (formData: ProjectFormData) => {
    const data = {
      formData,
      projectId,
    };
    mutate(data);
  };
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-0">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
        Editar Proyecto
      </h1>
      <p className="text-base sm:text-lg lg:text-2xl font-light text-gray-500 mt-4 md:mt-5">
        Llena el siguiente formulario para editar un proyecto
      </p>

      <nav className="my-4 md:my-5">
        <Link
          className="inline-block bg-fuchsia-600 hover:bg-fuchsia-800 px-3 md:px-4 shadow-inner shadow-white/60 py-1 md:py-2 text-white text-sm md:text-base lg:text-xl font-semibold transition-colors rounded"
          to="/"
        >
          Volver a Proyectos
        </Link>
      </nav>
      <form
        className="mt-8 md:mt-10 bg-white shadow-lg p-6 md:p-10 rounded"
        onSubmit={handleSubmit(handleForm)}
        noValidate
      >
        <ProjectForm register={register} errors={errors} />
        <input
          type="submit"
          value="Guardar Cambios"
          className="bg-fuchsia-600 hover:bg-fuchsia-800 transition-colors shadow-inner shadow-white/60 w-full p-2 md:p-3 text-white text-sm md:text-base lg:text-lg uppercase font-bold rounded cursor-pointer"
        />
      </form>
    </div>
  );
}
