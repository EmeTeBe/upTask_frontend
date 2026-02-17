import type { Project, TaskProject, TaskStatus } from "@/types/index";
import TaskCard from "./TaskCard";
import { statusTranslations } from "@/locales/es";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import DropTask from "./DropTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatusTask } from "@/services/TaskAPI";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

type TaskListProps = {
  tasks: TaskProject[];
  canEdit: boolean;
};

type GroupTask = {
  [key: string]: TaskProject[];
};

const initialStatusGroups: GroupTask = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  completed: [],
};

const statusStyles: { [key: string]: string } = {
  pending: "border-t-slate-400",
  onHold: "border-t-violet-400",
  inProgress: "border-t-blue-400",
  underReview: "border-t-amber-400",
  completed: "border-t-emerald-400",
};

export default function TaskList({ tasks, canEdit }: TaskListProps) {
  const params = useParams();
  const projectId = params.projectId!;
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateStatusTask,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast.success(data);
    },
  });

  const groupedTasks = tasks.reduce((acc, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    currentGroup = [...currentGroup, task];
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroups);

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;

    if (over && over.id) {
      const taskId = active.id.toString();
      const status = over.id as TaskStatus;

      mutate({ projectId, taskId, status });

      queryClient.setQueryData(["project", projectId], (oldData: Project) => {
        const updatedTasks = oldData.tasks.map((task: TaskProject) => {
          if (task._id === taskId) {
            return {
              ...task,
              status,
            };
          }
          return task;
        });
        return {
          ...oldData,
          tasks: updatedTasks,
        };
      });
    }
  };

  return (
    <div>
      <h2 className="text-5xl font-black mt-5">Tareas</h2>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-20">
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className="min-w-1/5 2xl:min-w-0 2xl:w-1/5 mt-5">
              <h3
                className={`capitalize text-xl font-light border border-slate-300 border-t-8 p-1 bg-white items-center text-center ${statusStyles[status]}`}
              >
                {statusTranslations[status]}
              </h3>
              <DropTask status={status} />
              <ul className="mt-5 space-y-5">
                {tasks.length === 0 ? (
                  <li className="text-gray-500 text-center pt-3">
                    No Hay tareas
                  </li>
                ) : (
                  tasks.map((task) => (
                    <TaskCard key={task._id} task={task} canEdit={canEdit} />
                  ))
                )}
              </ul>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
