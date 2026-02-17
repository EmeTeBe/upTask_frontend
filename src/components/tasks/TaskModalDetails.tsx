import { statusTranslations } from "@/locales/es";
import { getTaskById, updateStatusTask } from "@/services/TaskAPI";
import type { TaskStatus } from "@/types/index";
import { formatDate } from "@/utils/utils";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import NotesPanel from "../notes/NotesPanel";

export default function TaskModalDetails() {
  const params = useParams();
  const projectId = params.projectId!;
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!;
  const show = taskId ? true : false;

  const { data, isError, error } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    enabled: !!taskId,
    retry: false,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateStatusTask,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      toast.success(data);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const status = e.target.value as TaskStatus;
    const data = { projectId, taskId, status };
    mutate(data);
  };

  if (isError) {
    toast.error(error.message, { toastId: "error" });
    return <Navigate to={`/projects/${projectId}`} />;
  }

  if (data)
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
              className="w-full max-w-xl md:max-w-2xl rounded-xl bg-white/70 p-4 md:p-6 backdrop-blur-2xl shadow-inner shadow-white duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-xs md:text-sm text-slate-600">
                    Agregada el: {formatDate(data.createdAt)}
                  </p>
                  <p className="text-xs md:text-sm text-slate-600">
                    Última actualización: {formatDate(data.updatedAt)}
                  </p>
                </div>
                <Button
                  className="items-center h-8 rounded-md bg-fuchsia-900 px-2 py-1 shadow-inner shadow-white/40 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-fuchsia-500 data-open:bg-gray-700 cursor-pointer"
                  onClick={() => navigate(location.pathname, { replace: true })}
                >
                  <XCircleIcon className="text-white size-6" />
                </Button>
              </div>
              <DialogTitle
                as="h3"
                className="text-3xl font-semibold text-slate-800 my-3"
              >
                {data.taskName}
              </DialogTitle>
              <p className="text-lg text-slate-700 mb-2">
                Descripción: {data.description}
              </p>
              {data.statusChangeBy.length ? (
                <>
                  <p className="font-semibold text-sm text-slate-700 underline mb-2">
                    Historial de cambios:
                  </p>
                  {data.statusChangeBy.map((statusChange) => (
                    <p
                      key={statusChange._id}
                      className="font-mono text-purple-900"
                    >
                      {statusTranslations[statusChange.status]} por{" - "}
                      <span className="font-semibold font-sans text-slate-500">
                        {statusChange.user.name}
                      </span>
                    </p>
                  ))}
                </>
              ) : null}

              <div className="mt-2 text-right">
                <label
                  htmlFor="status"
                  className="font-semibold text-slate-500"
                >
                  Estado Actual:{" - "}
                </label>
                <select
                  name="status"
                  id="status"
                  className="w-fit py-1 items-center bg-white/70 border border-slate-500 outline-none focus:ring-purple-400 cursor-pointer"
                  defaultValue={data.status}
                  onChange={handleChange}
                >
                  {Object.entries(statusTranslations).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <NotesPanel notes={data.notes} />
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    );
}
