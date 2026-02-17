import ProfileForm from "@/components/profile/ProfileForm";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileView() {
  const { data, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    );
  }
  if (data) return <ProfileForm data={data} />;
}
