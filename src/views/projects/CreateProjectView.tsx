import ProjectForm from "@/components/projects/ProjectForm";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type { ProjectFormData } from "@/types/index";
import { createProject } from "@/services/ProjectAPI";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

export default function CreateProjectView() {
  const navigate = useNavigate();
  const initialValues: ProjectFormData = {
    projectName: "",
    clientName: "",
    description: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: createProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate("/");
    },
  });

  const handleForm = (formData: ProjectFormData) => mutate(formData);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-5xl font-black">Crear Proyecto</h1>
      <p className="text-2xl font-light text-gray-500 mt-5">
        Llena el siguiente formulario para crear un proyecto
      </p>

      <nav className="my-5">
        <Link
          className="bg-purple-400 hover:bg-purple-500 px-3 shadow py-1 items-center text-white lg:text-xl font-semibold transition-colors rounded"
          to="/"
        >
          Volver a Proyectos
        </Link>
      </nav>
      <form
        className="mt-10 bg-white shadow-lg p-10 rounded"
        onSubmit={handleSubmit(handleForm)}
        noValidate
      >
        <ProjectForm register={register} errors={errors} />
        <input
          type="submit"
          value="Crear PRoyectos"
          className="bg-fuchsia-400 hover:bg-fuchsia-500 transition-colors w-full p-3 text-white uppercase font-bold rounded cursor-pointer"
        />
      </form>
    </div>
  );
}
