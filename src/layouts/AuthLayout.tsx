import Logo from "@/components/Logo";
import { Outlet } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";

export default function AuthLayout() {
  return (
    <div className="bg-gray-800 min-h-screen">
      <div className="py-6 md:py-10 lg:py-16 mx-auto w-full max-w-md px-4">
        <Logo />
        <div className="mt-8 md:mt-10">
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
