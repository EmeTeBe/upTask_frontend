import { deleteTask } from "@/services/TaskAPI";
import type { TaskProject } from "@/types/index";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  ArchiveBoxIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDraggable } from "@dnd-kit/core";

type TaskCardProps = {
  task: TaskProject;
  canEdit: boolean;
};

const statusStyles: { [key: string]: string } = {
  pending: "border-t-slate-400",
  onHold: "border-t-violet-400",
  inProgress: "border-t-blue-400",
  underReview: "border-t-amber-400",
  completed: "border-t-emerald-400",
};

export default function TaskCard({ task, canEdit }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteTask,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast.success(data);
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        padding: "1.25rem",
        backgroundColor: "#FFF",
        minWidth: "280px",
        maxWidth: "100%",
        display: "flex",
        border: "2px solid #cbd5e1",
        borderWidth: "1px",
      }
    : undefined;

  return (
    <li
      className={`p-4 md:p-5 bg-white border border-slate-300 border-t-2 flex flex-col md:flex-row justify-between gap-3 rounded ${statusStyles[task.status]}`}
    >
      <div
        {...listeners}
        {...attributes}
        ref={setNodeRef}
        style={style}
        className="min-w-0 flex flex-col gap-y-2 md:gap-y-4 cursor-move"
      >
        <p className="text-base md:text-lg lg:text-xl font-semibold text-slate-600 text-left wrap-break-words">
          {task.taskName}
        </p>
        <p className="text-slate-500 text-xs md:text-sm font-light line-clamp-2">{task.description}</p>
      </div>
      <div className="shrink-0">
        <Menu>
          <MenuButton className="items-center cursor-pointer py-1 outline-none">
            <EllipsisVerticalIcon className="size-6 fill-slate-500 outline-none" />
          </MenuButton>
          <MenuItems
            transition
            anchor="bottom end"
            className="w-52 origin-top-right shadow-2xl rounded ring-1 ring-gray-900/5 bg-white  p-1 text-sm transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
          >
            <MenuItem>
              <button
                type="button"
                className="group flex gap-2 items-center w-full text-left p-1 text-slate-600 rounded cursor-pointer data-focus:bg-purple-100"
                onClick={() =>
                  navigate(location.pathname + `?viewTask=${task._id}`)
                }
              >
                <ArchiveBoxIcon className="size-4 fill-slate-400" />
                Ver tarea
              </button>
            </MenuItem>
            {canEdit && (
              <>
                <MenuItem>
                  <button
                    type="button"
                    className="group flex gap-2 items-center w-full text-left p-1 text-slate-600 rounded cursor-pointer data-focus:bg-purple-100"
                    onClick={() =>
                      navigate(location.pathname + `?editTask=${task._id}`)
                    }
                  >
                    <PencilIcon className="size-4 fill-slate-400" />
                    Editar tarea
                  </button>
                </MenuItem>
                <div className="my-1 h-px bg-gray-200" />
                <MenuItem>
                  <button
                    type="button"
                    className="group flex gap-2 items-center w-full text-left p-1 text-red-400 rounded cursor-pointer data-focus:bg-red-100"
                    onClick={() => mutate({ projectId, taskId: task._id })}
                  >
                    <TrashIcon className="size-4 fill-red-300" />
                    Eliminar tarea
                  </button>
                </MenuItem>
              </>
            )}
          </MenuItems>
        </Menu>
      </div>
    </li>
  );
}
