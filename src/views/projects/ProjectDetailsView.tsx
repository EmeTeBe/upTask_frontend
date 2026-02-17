import AddTaskModal from "@/components/tasks/AddTaskModal";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskList from "@/components/tasks/TaskList";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useAuth } from "@/hooks/useAuth";
import { getFullProjectById } from "@/services/ProjectAPI";
import { isManager } from "@/utils/policies";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

export default function ProjectDetailsView() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  const { data: user, isLoading: authLoading } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getFullProjectById(projectId),
    retry: false,
  });

  const canEdit = useMemo(() => data?.manager === user?._id, [data, user]);

  if (isLoading && authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (isError) return <Navigate to="/404" />;
  if (data && user)
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-semibold">{data.projectName}</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          {data.description}
        </p>
        {isManager(data.manager, user._id) && (
          <nav className="mt-5 flex gap-5">
            <button
              type="button"
              className="bg-fuchsia-600 hover:bg-fuchsia-800 px-3 py-1 items-center shadow-inner shadow-white/60 text-white lg:text-xl font-semibold cursor-pointer rounded transition-colors"
              onClick={() => navigate(location.pathname + "?newTask=true")}
            >
              Agregar Tarea
            </button>
            <Link
              to={"team"}
              className="bg-fuchsia-600 hover:bg-fuchsia-800 px-3 py-1 items-center shadow-inner shadow-white/60 text-white lg:text-xl font-semibold rounded transition-colors"
            >
              Colaboradores
            </Link>
          </nav>
        )}

        <TaskList tasks={data.tasks} canEdit={canEdit} />
        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </div>
    );
}
