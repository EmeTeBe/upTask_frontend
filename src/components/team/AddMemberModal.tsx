import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import type { TeamMemberForm } from "@/types/index";
import AddMemberForm from "./AddMemberForm";
import { findUserByEmail } from "@/services/TeamAPI";
import ErrorMessage from "../ErrorMessage";
import SearchResult from "./SearchResult";

export default function AddMemberModal() {
  const navigate = useNavigate();

  // Leer si modal eaxiste
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const addMember = queryParams.get("addMember");
  const show = addMember ? true : false;

  // Obtener projectId
  const params = useParams();
  const projectId = params.projectId!;

  const initialValues: TeamMemberForm = {
    email: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const mutation = useMutation({
    mutationFn: findUserByEmail,
  });

  const handleSearchUser = (formData: TeamMemberForm) => {
    const data = {
      projectId,
      formData,
    };
    mutation.mutate(data);
    reset();
  };

  const resetData = () => {
    mutation.reset();
  };

  const closeModal = () => {
    navigate(location.pathname, { replace: true });
    reset();
    mutation.reset();
  };

  return (
    <Dialog
      open={show}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={closeModal}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto backdrop-blur-sm bg-black/30">
        <div className="flex min-h-full items-center justify-center p-3 md:p-4">
          <DialogPanel
            transition
            className="w-full max-w-xl md:max-w-2xl rounded-xl border-gray-100 shadow bg-white p-4 md:p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <div className="mb-4 md:mb-5 flex justify-between items-start gap-4">
              <div className="flex flex-col">
                <DialogTitle
                  as="h3"
                  className="text-lg md:text-2xl font-semibold text-black"
                >
                  Agregar colaborador al equipo
                </DialogTitle>
                <p className="mt-2 text-xs md:text-sm/6 text-black">
                  Busca el nuevo integrante por email{" "}
                  <span className="text-fuchsia-700">
                    para agregarlo al proyecto
                  </span>
                </p>
              </div>
              <Button
                className="shrink-0 items-center h-7 md:h-8 rounded-md bg-fuchsia-600 px-2 py-1 shadow-inner shadow-white/60 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-fuchsia-800 data-open:bg-gray-700 cursor-pointer"
                onClick={closeModal}
              >
                <XCircleIcon className="text-white size-5 md:size-6" />
              </Button>
            </div>
            <form
              className="mt-5 space-y-4 md:space-y-5"
              noValidate
              onSubmit={handleSubmit(handleSearchUser)}
            >
              <AddMemberForm register={register} errors={errors} />
              <input
                type="submit"
                className="bg-fuchsia-600 hover:bg-fuchsia-800 shadow-inner shadow-white/60 transition-colors w-full p-2 md:p-3 text-xs md:text-lg text-white uppercase font-bold rounded cursor-pointer"
                value="Buscar Usuario"
              />
            </form>
            {mutation.isPending && (
              <div className="mt-5 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}
            {mutation.error && (
              <ErrorMessage>{mutation.error.message}</ErrorMessage>
            )}
            {mutation.data && (
              <SearchResult user={mutation.data} reset={resetData} />
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
