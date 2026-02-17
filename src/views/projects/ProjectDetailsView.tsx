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
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold wrap-break-word">
          {data.projectName}
        </h1>
        <p className="text-base sm:text-lg lg:text-2xl font-light text-gray-500 mt-4 md:mt-5">
          {data.description}
        </p>
        {isManager(data.manager, user._id) && (
          <nav className="mt-5 flex flex-col sm:flex-row gap-3 sm:gap-5">
            <button
              type="button"
              className="bg-fuchsia-600 hover:bg-fuchsia-800 px-3 md:px-4 py-1 md:py-2 shadow-inner shadow-white/60 text-white text-sm md:text-base lg:text-xl font-semibold cursor-pointer rounded transition-colors"
              onClick={() => navigate(location.pathname + "?newTask=true")}
            >
              Agregar Tarea
            </button>
            <Link
              to={"team"}
              className="bg-fuchsia-600 hover:bg-fuchsia-800 px-3 md:px-4 py-1 md:py-2 shadow-inner shadow-white/60 text-white text-sm md:text-base lg:text-xl font-semibold rounded transition-colors text-center"
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
