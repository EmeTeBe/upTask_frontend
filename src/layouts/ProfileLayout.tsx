import Tabs from "@/components/profile/Tabs";
import { Outlet } from "react-router-dom";

export default function ProfileLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-0">
      <Tabs />
      <Outlet />
    </div>
  );
}
