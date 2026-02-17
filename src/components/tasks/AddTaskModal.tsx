import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TaskForm from "./TaskForm";
import type { TaskFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/services/TaskAPI";
import { toast } from "react-toastify";

export default function AddTaskModal() {
  const navigate = useNavigate();

  // Leer si modal eaxiste
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const modalTask = queryParams.get("newTask");
  const show = modalTask ? true : false;

  // Obtener projectId
  const params = useParams();
  const projectId = params.projectId!;

  const initialValues: TaskFormData = {
    taskName: "",
    description: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createTask,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast.success(data);
      reset();
      navigate(location.pathname, { replace: true });
    },
  });

  const handleCreateTask = (formData: TaskFormData) => {
    const data = {
      formData,
      projectId,
    };
    mutate(data);
  };

  return (
    <Dialog
      open={show}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={() => navigate(location.pathname, { replace: true })}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto backdrop-blur-sm bg-black/30">
        <div className="flex min-h-full items-center justify-center p-3 md:p-4">
          <DialogPanel
            transition
            className="w-full max-w-xl md:max-w-2xl rounded-xl border-gray-100 shadow bg-white p-4 md:p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <div className="mb-4 md:mb-5 flex justify-between items-start gap-4">
              <div className="flex flex-col">
                <DialogTitle
                  as="h3"
                  className="text-lg md:text-2xl font-semibold text-black"
                >
                  Nueva Tarea
                </DialogTitle>
                <p className="mt-2 text-xs md:text-sm/6 text-black">
                  Llena el formulario y creá una tarea
                </p>
              </div>
              <Button
                className="shrink-0 items-center h-7 md:h-8 rounded-md bg-fuchsia-600 px-2 py-1 shadow-inner shadow-white/60 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-fuchsia-800 data-open:bg-gray-700 cursor-pointer"
                onClick={() => navigate(location.pathname, { replace: true })}
              >
                <XCircleIcon className="text-white size-5 md:size-6" />
              </Button>
            </div>
            <form
              className="mt-8 md:mt-10 space-y-3"
              noValidate
              onSubmit={handleSubmit(handleCreateTask)}
            >
              <TaskForm register={register} errors={errors} />
              <input
                type="submit"
                className="bg-fuchsia-600 hover:bg-fuchsia-800 shadow-inner shadow-white/60 transition-colors w-full p-2 md:p-3 text-xs md:text-lg text-white uppercase font-bold rounded cursor-pointer"
                value="Guardar Tarea"
              />
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
