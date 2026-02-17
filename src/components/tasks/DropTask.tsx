import { useDroppable } from "@dnd-kit/core";

export default function DropTask({ status }: { status: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  const style = {
    opacity: isOver ? 0.4 : undefined,
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      className="text-xs font-semibold font-mono uppercase p-2 border border-dashed border-slate-400 mt-5 grid place-content-center text-slate-500"
    >
      Soltar tarea aquí
    </div>
  );
}
