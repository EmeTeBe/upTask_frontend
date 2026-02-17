import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createNote } from "@/services/NotesAPI";

export default function AddNotesForm() {
  const [content, setContent] = useState("");
  const params = useParams();
  const projectId = params.projectId!;
  const queryParams = new URLSearchParams(window.location.search);
  const taskId = queryParams.get("viewTask")!;

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("La nota no puede estar vacía");
      return;
    }
    mutate({
      formData: { content },
      projectId,
      taskId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5" noValidate>
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Agregar Nota
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe una nota..."
          className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          disabled={isPending}
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="mt-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 px-4 py-2 text-white rounded-lg font-semibold transition-colors"
      >
        {isPending ? "Guardando..." : "Guardar Nota"}
      </button>
    </form>
  );
}

