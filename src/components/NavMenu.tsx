import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import type { User } from "../types";
import { useQueryClient } from "@tanstack/react-query";

type NavMenuProps = {
  name: User["name"];
};

export default function NavMenu({ name }: NavMenuProps) {
  const queryClient = useQueryClient();
  const logout = () => {
    localStorage.removeItem("AUTH_JWT");
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return (
    <Popover>
      <PopoverButton className="block bg-purple-500 focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-purple-800 rounded cursor-pointer">
        <Bars3Icon className="w-8 h-8 text-white " />
      </PopoverButton>
      <PopoverPanel
        transition
        anchor="bottom"
        className="divide-y divide-white/5 rounded-xl bg-white text-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
      >
        <div className="p-2">
          <p className="text-center">Hola {name}</p>
          <div className="my-1 h-px bg-gray-200" />
          <Link
            to="/profile"
            className="block rounded-lg px-3 py-2 transition hover:bg-purple-100"
          >
            <p>Mi Perfil</p>
          </Link>
          <Link
            to="/"
            className="block rounded-lg px-3 py-2 transition hover:bg-purple-100"
          >
            <p>Mis Proyectos</p>
          </Link>
          <div className="my-1 h-px bg-gray-200" />
          <button
            className="block w-full text-left px-3 py-2 rounded-lg transition hover:bg-red-100 cursor-pointer"
            type="button"
            onClick={logout}
          >
            Cerrar Sesión
          </button>
        </div>
      </PopoverPanel>
    </Popover>
  );
}
