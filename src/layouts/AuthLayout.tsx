import Logo from "@/components/Logo";
import { Outlet } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";

export default function AuthLayout() {
  return (
    <div className="bg-gray-800 min-h-screen">
      <div className="py-10 lg:py-2 mx-auto w-md">
        <Logo />
        <div className="mt-10">
          <Outlet />
        </div>
      </div>
      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        transition={Slide}
      />
    </div>
  );
}
