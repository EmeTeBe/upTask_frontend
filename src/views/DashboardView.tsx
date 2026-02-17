import { getProject } from "@/services/ProjectAPI";
import { useQuery } from "@tanstack/react-query";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policies";
import DeleteProjectModal from "@/components/projects/DeleteProjectModal";

export default function DashboardView() {
  const location = useLocation();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProject,
  });

  const { data: user, isLoading: authLoading } = useAuth();

  if (isLoading && authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (data && user)
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-semibold">Mis Proyectos</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Maneja y administra tus proyectos
        </p>

        <nav className="mt-5 px-">
          <Link
            className="bg-fuchsia-600 hover:bg-fuchsia-800 px-3 shadow-inner shadow-white/60 py-1 items-center text-white lg:text-xl font-semibold transition-colors rounded"
            to="/projects/create"
          >
            Nuevo Proyecto
          </Link>
        </nav>
        {data.length ? (
          <ul
            role="list"
            className="divide-y divide-gray-200 border border-gray-100 mt-10 bg-white shadow-lg"
          >
            {data.map((project) => (
              <li
                key={project._id}
                className="flex justify-between gap-x-6 px-5 py-6"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 space-y-2">
                    {isManager(project.manager, user._id) ? (
                      <p className="px-2 py-1 bg-purple-600 rounded-4xl uppercase text-xs font-bold font-mono text-white w-fit shadow-inner shadow-white/50">
                        Mánager
                      </p>
                    ) : (
                      <p className="px-2 py-1 bg-purple-400 rounded-4xl uppercase text-xs font-bold font-mono text-white w-fit shadow-inner shadow-white/50">
                        Miembro del equipo
                      </p>
                    )}
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
                    >
                      {project.projectName}
                    </Link>
                    <p className="text-sm text-gray-400 mt-2">
                      Cliente: {project.clientName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {project.description}
                    </p>
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
                      className="w-52 origin-top-right items-center rounded ring-1 ring-gray-900/5 bg-gray-50 shadow-xl p-1 text-sm transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                    >
                      <MenuItem>
                        <Link
                          className="block px-3 py-1 text-sm leading-6 text-gray-900 data-focus:bg-purple-100"
                          to={`/projects/${project._id}`}
                        >
                          Ver Proyecto
                        </Link>
                      </MenuItem>

                      {isManager(project.manager, user._id) && (
                        <>
                          <MenuItem>
                            <Link
                              className="block px-3 py-1 text-sm leading-6 text-gray-900 data-focus:bg-purple-100"
                              to={`/projects/${project._id}/edit`}
                            >
                              Editar Proyecto
                            </Link>
                          </MenuItem>
                          <div className="my-1 h-px bg-gray-200" />
                          <MenuItem>
                            <button
                              className="block w-full text-left px-3 py-1 text-sm leading-6 text-red-900 data-focus:bg-red-100 cursor-pointer"
                              type="button"
                              onClick={() =>
                                navigate(
                                  location.pathname +
                                    `?deleteProject=${project._id}`,
                                )
                              }
                            >
                              Eliminar Proyecto
                            </button>
                          </MenuItem>
                        </>
                      )}
                    </MenuItems>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-20">
            No hay proyectos aún {""}
            <Link to="/projects/create" className="text-fuchsia-400 font-bold">
              Crear Proyectos
            </Link>
          </p>
        )}
        <DeleteProjectModal />
      </div>
    );
}
