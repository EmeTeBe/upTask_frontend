import { Link, Navigate, Outlet } from "react-router-dom";
import Logo from "@/components/Logo";
import NavMenu from "@/components/NavMenu";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/hooks/useAuth";

export default function AppLayout() {
  const { data, isError, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (isError) {
    return <Navigate to="/auth/login" />;
  }

  if (data)
    return (
      <div className="flex flex-col">
        <header className="bg-gray-800 py-5 px-10">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center">
            <div className="w-64">
              <Link to={`/`}>
                <Logo />
              </Link>
            </div>
            <NavMenu 
            name={data.name}
            />
          </div>
        </header>
        <section className="mt-10 px-10">
          <Outlet />
        </section>
        <footer className="py-5 px-10">
          <p className="text-center">
            Todos los derechos reservados {new Date().getFullYear()}
          </p>
        </footer>
        <ToastContainer
          pauseOnFocusLoss={false}
          pauseOnHover={false}
          transition={Slide}
        />
      </div>
    );
}
