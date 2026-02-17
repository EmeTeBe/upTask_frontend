import type { Task, TaskFormData } from "@/types/index";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TaskForm from "./TaskForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/services/TaskAPI";
import { toast } from "react-toastify";

type EditTaskModalProps = {
  data: Task;
};

export default function EditTaskModal({ data }: EditTaskModalProps) {
  const navigate = useNavigate();

  const params = useParams();
  const projectId = params.projectId!;

  // Leer si modal eaxiste
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("editTask")!;
  const show = taskId ? true : false;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      taskName: data.taskName,
      description: data.description,
    },
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateTask,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      toast.success(data);
      navigate(location.pathname, { replace: true });
    },
  });

  const handleEditTask = (formData: TaskFormData) => {
    const data = {
      projectId,
      taskId,
      formData,
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
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/40">
        <div className="flex min-h-full items-center justify-center p-3 md:p-4">
          <DialogPanel
            transition
            className="w-full max-w-xl md:max-w-2xl rounded-xl bg-white/70 p-4 md:p-6 backdrop-blur-lg shadow-inner shadow-white duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <div className="mb-4 md:mb-5 flex justify-between items-start gap-4">
              <div className="flex flex-col">
                <DialogTitle
                  as="h3"
                  className="text-lg md:text-2xl font-medium text-slate-800"
                >
                  Editar Tarea
                </DialogTitle>
                <p className="mt-2 text-xs md:text-sm text-slate-800">
                  Realiza cambios a una tarea en este formulario
                </p>
              </div>
              <Button
                className="shrink-0 items-center h-7 md:h-8 rounded-md bg-fuchsia-900 px-2 py-1 shadow-inner shadow-white/40 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-fuchsia-500 data-open:bg-gray-700 cursor-pointer"
                onClick={() => navigate(location.pathname, { replace: true })}
              >
                <XCircleIcon className="text-white size-5 md:size-6" />
              </Button>
            </div>
            <form
              className="mt-6 md:mt-10 space-y-3"
              noValidate
              onSubmit={handleSubmit(handleEditTask)}
            >
              <TaskForm register={register} errors={errors} />

              <input
                type="submit"
                className="bg-fuchsia-400 hover:bg-fuchsia-500 shadow-inner shadow-white/40 transition-colors w-full p-1 text-sm lg:text-lg text-white uppercase font-bold rounded cursor-pointer"
                value="Guardar Tarea"
              />
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
