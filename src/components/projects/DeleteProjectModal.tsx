import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ErrorMessage from "../ErrorMessage";
import type { CheckPasswordForm } from "@/types/index";
import { checkPassword } from "@/services/AuthAPI";
import { deleteProject } from "@/services/ProjectAPI";

export default function DeleteProjectModal() {
  const initialValues: CheckPasswordForm = {
    password: "",
  };

  const navigate = useNavigate();

  // Leer si modal eaxiste
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const deleteProjectId = queryParams.get("deleteProject")!;
  const show = deleteProjectId ? true : false;

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  const { mutateAsync: checkPasswordMutate } = useMutation({
    mutationFn: checkPassword,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutateAsync: deleteProjectMutate } = useMutation({
    mutationFn: deleteProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeModal();
    },
  });

  const closeModal = () => {
    reset();
    navigate(location.pathname, { replace: true });
  };

  const handleEditTask = async (formData: CheckPasswordForm) => {
    await checkPasswordMutate(formData);
    await deleteProjectMutate(deleteProjectId);
  };

  return (
    <Dialog
      open={show}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={closeModal}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/40">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-2xl rounded-xl bg-white/70 p-6 backdrop-blur-lg shadow-inner shadow-white duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <div className="mb-5 flex justify-between">
              <div className="flex flex-col">
                <DialogTitle
                  as="h3"
                  className="text-2xl font-medium text-slate-800"
                >
                  ELiminar Proyecto
                </DialogTitle>
                <p className="mt-2 text-sm text-slate-800">
                  Confirma la eliminación de este proyecto{" "}
                  <span className="text-fuchsia-700">
                    colocando tu contraseña
                  </span>
                </p>
              </div>
              <Button
                className="items-center h-8 rounded-md bg-fuchsia-900 px-2 py-1 shadow-inner shadow-white/40 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-fuchsia-500 data-open:bg-gray-700 cursor-pointer"
                onClick={closeModal}
              >
                <XCircleIcon className="text-white size-6" />
              </Button>
            </div>
            <form
              className="mt-10 space-y-3"
              noValidate
              onSubmit={handleSubmit(handleEditTask)}
            >
              {errors.password && (
                <ErrorMessage>{errors.password.message}</ErrorMessage>
              )}
              <div className="flex flex-col gap-3">
                <label className="font-normal text-2xl" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Contraseña Inicio de Sesión"
                  autoFocus
                  className="w-full p-3  border-gray-300 border rounded"
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                  })}
                />
              </div>
              <input
                type="submit"
                className="bg-fuchsia-600 hover:bg-fuchsia-800 shadow-inner shadow-white/60 transition-colors w-full p-1 text-sm lg:text-lg text-white uppercase font-bold rounded cursor-pointer"
                value="Eliminar Proyecto"
              />
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
