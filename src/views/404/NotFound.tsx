import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <h1 className="font-black text-center text-2xl sm:text-3xl lg:text-4xl text-white">
        Problemas con la página solicitada
      </h1>
      <p className="mt-6 md:mt-10 text-center text-white text-sm md:text-base">
        Tal vez quieras volver a la página de{" "}
        <Link to={"/"} className="text-fuchsia-600">
          Proyectos
        </Link>
      </p>
    </div>
  );
}
