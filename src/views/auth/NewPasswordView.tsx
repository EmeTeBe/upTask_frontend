import NewPasswordToken from "@/components/auth/NewPasswordToken";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { useState } from "react";
import type { ConfirmToken } from "@/types/index";

export default function ConfirmAccountView() {
  const [token, setToken] = useState<ConfirmToken["token"]>("");
  const [isValidToken, setIsValidToken] = useState(false);

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center">
        Reestablecer Contraseña
      </h1>
      <p className="text-sm sm:text-lg lg:text-2xl font-light text-white mt-4 md:mt-5 text-center">
        Ingresa el código que recibiste {""}
        <span className=" text-fuchsia-500 font-bold"> por e-mail</span>
      </p>

      {!isValidToken ? (
        <NewPasswordToken
          token={token}
          setToken={setToken}
          setIsValidToken={setIsValidToken}
        />
      ) : (
        <NewPasswordForm token={token} />
      )}
    </div>
  );
}
