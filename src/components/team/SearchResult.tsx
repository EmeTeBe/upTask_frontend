import { addUserToProject } from "@/services/TeamAPI";
import type { TeamMember } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

type SearchResultProps = {
  user: TeamMember;
  reset: () => void;
};

export default function SearchResult({ user, reset }: SearchResultProps) {
  const params = useParams();
  const projectId = params.projectId!;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: addUserToProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset();
      queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });
    },
  });

  const handleAddUserToProject = () => {
    const data = {
      projectId,
      id: user._id,
    };
    mutate(data);
  };

  return (
    <div>
      <p className="mt-5 text-center font-bold">Resultado:</p>
      <div className="flex justify-between items-center mt-5 border border-slate-300 p-3">
        <p>{user.name}</p>
        <button
          className="px-3 py-2 items-center text-purple-700 font-semibold cursor-pointer hover:bg-purple-200 transition-colors rounded"
          onClick={handleAddUserToProject}
        >
          Agregar al Proyecto
        </button>
      </div>
    </div>
  );
}
