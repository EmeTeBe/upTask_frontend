import { validateToken } from "@/services/AuthAPI";
import type { ConfirmToken } from "@/types/index";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

type NewPasswordTokenProps = {
  token: ConfirmToken["token"];
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewPasswordToken({
  token,
  setToken,
  setIsValidToken,
}: NewPasswordTokenProps) {
  const { mutate } = useMutation({
    mutationFn: validateToken,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      setIsValidToken(true);
    },
  });

  const handleChange = (token: ConfirmToken["token"]) => {
    setToken(token);
  };
  const handleComplete = (token: ConfirmToken["token"]) => mutate({ token });

  return (
    <div>
      <form className="space-y-6 md:space-y-8 p-6 md:p-10 rounded-lg bg-white mt-6 md:mt-10">
        <label className="font-normal text-base md:text-lg lg:text-2xl text-center block">
          Código de 6 dígitos
        </label>
        <div className="flex justify-center gap-3 md:gap-5">
          <PinInput
            value={token}
            onChange={handleChange}
            onComplete={handleComplete}
          >
            <PinInputField
              className="size-10 md:size-12 text-center rounded-lg border border-gray-300 placeholder-white text-sm md:text-base"
              autoFocus
            />
            <PinInputField className="size-10 md:size-12 text-center rounded-lg border border-gray-300 placeholder-white text-sm md:text-base" />
            <PinInputField className="size-10 md:size-12 text-center rounded-lg border border-gray-300 placeholder-white text-sm md:text-base" />
            <PinInputField className="size-10 md:size-12 text-center rounded-lg border border-gray-300 placeholder-white text-sm md:text-base" />
            <PinInputField className="size-10 md:size-12 text-center rounded-lg border border-gray-300 placeholder-white text-sm md:text-base" />
            <PinInputField className="size-10 md:size-12 text-center rounded-lg border border-gray-300 placeholder-white text-sm md:text-base" />
          </PinInput>
        </div>
      </form>
      <nav className="mt-6 md:mt-10 flex flex-col space-y-2 md:space-y-4">
        <Link
          to="/auth/forgot-password"
          className="text-center text-gray-300 font-normal text-xs md:text-sm"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </div>
  );
}
