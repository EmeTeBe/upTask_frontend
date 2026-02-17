import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteNote } from "@/services/NotesAPI";
import { useAuth } from "@/hooks/useAuth";
import { TrashIcon } from "@heroicons/react/24/outline";
import AddNotesForm from "./AddNotesForm";
import type { Task } from "@/types/index";
import { formatDate } from "@/utils/utils";

type NotesPanelProps = {
  notes: Task["notes"];
};

export default function NotesPanel({ notes }: NotesPanelProps) {
  const params = useParams();
  const projectId = params.projectId!;
  const queryParams = new URLSearchParams(window.location.search);
  const taskId = queryParams.get("viewTask")!;

  const { data: user, isLoading } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: deleteNoteMutate } = useMutation({
    mutationFn: deleteNote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  const handleDeleteNote = (noteId: string) => {
    deleteNoteMutate({
      projectId,
      taskId,
      noteId,
    });
  };

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-bold text-slate-800 mb-4">Notas</h3>

      {isLoading ? (
        <div className="text-center py-4 text-slate-500">Cargando notas...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-4 text-slate-500 bg-slate-100 rounded-lg">
          No hay notas aún. ¡Sé el primero en agregar una!
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note._id}
              className="flex justify-between border border-slate-200 rounded-lg p-2 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div>
                <p className="text-slate-800 font-semibold leading-relaxed wrap-break-word">
                  {note.content} por:{" "}
                  <span className="font-bold text-slate-800">
                    {note.createBy.name}
                  </span>
                </p>
                <div className="my-1 h-px bg-gray-200" />

                <p className="font-mono font-light text-xs text-slate-600">
                  {formatDate(note.createdAt)}
                </p>
              </div>
              {user?._id === note.createBy._id && (
                <button
                  type="button"
                  onClick={() => handleDeleteNote(note._id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer"
                  title="Eliminar nota"
                >
                  <TrashIcon className="size-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <AddNotesForm />
    </div>
  );
}
