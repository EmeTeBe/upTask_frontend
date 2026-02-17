import AddMemberModal from "@/components/team/AddMemberModal";
import { getProjectTeam, removeUserFromProject } from "@/services/TeamAPI";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProjectTeamView() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["projectTeam", projectId],
    queryFn: () => getProjectTeam(projectId),
    retry: false,
  });

  const { mutate } = useMutation({
    mutationFn: removeUserFromProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) return <Navigate to={"/404"} />;

  if (data)
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-semibold">Administra el Equipo</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Administra los colaboradores de este proyecto para formar el equipo de
          trabajo.
        </p>
        <nav className="mt-5 flex gap-5">
          <button
            type="button"
            className="bg-fuchsia-600 hover:bg-fuchsia-800 px-3 py-1 items-center shadow-inner shadow-white/60 text-white lg:text-xl font-semibold cursor-pointer rounded transition-colors"
            onClick={() => navigate(location.pathname + "?addMember=true")}
          >
            Agregar Colaborador
          </button>
          <Link
            to={`/projects/${projectId}`}
            className="bg-fuchsia-600 hover:bg-fuchsia-800 px-3 py-1 items-center shadow-inner shadow-white/60 text-white lg:text-xl font-semibold rounded transition-colors"
          >
            Volver al Proyecto
          </Link>
        </nav>

        <h2 className="text-3xl font-bold mt-5">Miembros del Proyecto</h2>
        {data.length ? (
          <ul
            role="list"
            className="divide-y divide-gray-200 border border-gray-100 mt-10 bg-white shadow-lg"
          >
            {data?.map((member) => (
              <li
                key={member._id}
                className="flex justify-between gap-x-6 px-5 py-8"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    <p className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold">
                      {member.name}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">{member.email}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-6">
                  <Menu>
                    <MenuButton className="cursor-pointer outline-none items-center">
                      <span className="sr-only">opciones</span>
                      <EllipsisVerticalIcon className="h-9 w-9 aria-hidden:true outline-none" />
                    </MenuButton>
                    <MenuItems
                      transition
                      anchor="bottom end"
                      className="w-52 origin-top-right items-center rounded-xl ring-1 ring-gray-900/5 bg-gray-50 shadow-xl p-1 text-sm transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                    >
                      <MenuItem>
                        <button
                          className="block w-full text-left px-3 py-1 text-sm leading-6 text-red-900 data-focus:bg-red-100 cursor-pointer"
                          type="button"
                          onClick={() =>
                            mutate({ projectId, userId: member._id })
                          }
                        >
                          Eliminar del Proyecto
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-20">No hay miembros en el equipo</p>
        )}

        <AddMemberModal />
      </div>
    );
}
