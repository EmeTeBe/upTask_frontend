export default function ErrorMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="text-center my-2 bg-red-200 text-red-400 p-2 md:p-3 uppercase text-xs md:text-sm font-bold rounded">
      {children}
    </div>
  );
}
