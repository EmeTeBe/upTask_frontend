export default function ErrorMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="text-center my-4 bg-red-200 text-red-400 p-3 uppercase text-sm font-bold rounded">
      {children}
    </div>
  );
}
